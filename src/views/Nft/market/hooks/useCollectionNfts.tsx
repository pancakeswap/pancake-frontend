import { useEffect, useState } from 'react'
import { ApiResponseCollectionTokens, NftAttribute, NftToken } from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import {
  fetchNftsFiltered,
  getMarketDataForTokenIds,
  getNftApi,
  getNftsFromCollectionApi,
  getNftsMarketData,
} from 'state/nftMarket/helpers'
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { REQUEST_SIZE } from '../Collection/config'

export const useCollectionNfts = (collectionAddress: string) => {
  const [isFetchingNfts, setIsFetchingNfts] = useState(true)
  const [nfts, setNfts] = useState<NftToken[]>([])
  const [page, setPage] = useState(1)
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState({
    page: 1,
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setIsFetchingNfts(true)
      setItemListingSettings((prevState) => ({
        ...prevState,
        page,
      }))
    })
  }, [page])

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setIsFetchingNfts(true)
      setNfts([])
      setItemListingSettings((prevState) => ({
        page: prevState.page,
        field,
        direction,
        showOnlyNftsOnSale,
        nftFilters: JSON.parse(filtersJson),
      }))
    })
  }, [field, direction, showOnlyNftsOnSale, filtersJson])

  useEffect(() => {
    const fetchTokenIdsFromFilter = async () => {
      const filterObject: Record<string, NftAttribute> = settingsObject.nftFilters
      const attrParams = Object.values(filterObject).reduce(
        (accum, attr) => ({
          ...accum,
          [attr.traitType]: attr.value,
        }),
        {},
      )
      const attrFilters = !isEmpty(attrParams) ? await fetchNftsFiltered(collectionAddress, attrParams) : null
      return attrFilters ? Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId) : null
    }

    const fetchMarketDataNfts = async () => {
      const tokenIdsFromFilter = await fetchTokenIdsFromFilter()
      const whereClause = tokenIdsFromFilter
        ? {
            collection: collectionAddress.toLowerCase(),
            isTradable: true,
            tokenId_in: tokenIdsFromFilter,
          }
        : { collection: collectionAddress.toLowerCase(), isTradable: true }
      const subgraphRes = await getNftsMarketData(
        whereClause,
        REQUEST_SIZE,
        settingsObject.field,
        settingsObject.direction,
        (settingsObject.page - 1) * REQUEST_SIZE,
      )
      const apiRequestPromises = subgraphRes.map((marketNft) => getNftApi(collectionAddress, marketNft.tokenId))
      const apiResponses = await Promise.all(apiRequestPromises)
      const newNfts = apiResponses.reduce((acc, apiNft) => {
        if (apiNft) {
          acc.push({
            ...apiNft,
            collectionAddress,
            collectionName: apiNft.collection.name,
            marketData: subgraphRes.find((marketNft) => marketNft.tokenId === apiNft.tokenId),
          })
        }
        return acc
      }, [])
      unstable_batchedUpdates(() => {
        setIsFetchingNfts(false)
        setNfts((prevState) => {
          const combinedNfts = [...prevState, ...newNfts]
          return uniqBy(combinedNfts, 'tokenId')
        })
      })
    }

    const fetchAllNfts = async () => {
      const tokenIdsFromFilter = await fetchTokenIdsFromFilter()

      let collectionNftsResponse: ApiResponseCollectionTokens = null
      let tokenIds = null

      if (tokenIdsFromFilter) {
        tokenIds = tokenIdsFromFilter
      } else {
        collectionNftsResponse = await getNftsFromCollectionApi(collectionAddress, REQUEST_SIZE, settingsObject.page)
        if (collectionNftsResponse?.data) {
          tokenIds = Object.values(collectionNftsResponse.data).map((nft) => nft.tokenId)
        }
      }

      if (tokenIds) {
        const nftsMarket = await getMarketDataForTokenIds(collectionAddress, tokenIds)

        const responsesPromises = tokenIds.map(async (id) => {
          const apiMetadata = collectionNftsResponse
            ? collectionNftsResponse.data[id]
            : await getNftApi(collectionAddress, id)
          const marketData = nftsMarket.find((nft) => nft.tokenId === id)

          return {
            tokenId: id,
            name: apiMetadata.name,
            description: apiMetadata.description,
            collectionName: apiMetadata.collection.name,
            collectionAddress,
            image: apiMetadata.image,
            attributes: apiMetadata.attributes,
            marketData,
          }
        })

        const newNfts: NftToken[] = await Promise.all(responsesPromises)
        unstable_batchedUpdates(() => {
          setIsFetchingNfts(false)
          setNfts((prevState) => {
            const combinedNfts = [...prevState, ...newNfts]
            return uniqBy(combinedNfts, 'tokenId')
          })
        })
      }
    }

    const settingsObject = JSON.parse(itemListingSettingsJson)
    if (settingsObject.showOnlyNftsOnSale || settingsObject.field !== 'tokenId') {
      fetchMarketDataNfts()
    } else {
      fetchAllNfts()
    }
  }, [collectionAddress, itemListingSettingsJson])

  return {
    nfts,
    isFetchingNfts,
    setPage,
    showOnlyNftsOnSale,
    orderField: field,
    nftFilters,
  }
}
