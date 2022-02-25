import { useEffect, useState } from 'react'
import { ApiResponseCollectionTokens, ApiSingleTokenData, NftAttribute, NftToken } from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import {
  fetchNftsFiltered,
  getMarketDataForTokenIds,
  getNftApi,
  getNftsFromCollectionApi,
  getNftsMarketData,
} from 'state/nftMarket/helpers'
// eslint-disable-next-line camelcase
import useSWRInfinite from 'swr/infinite'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { REQUEST_SIZE } from '../Collection/config'

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  nftFilters: Record<string, NftAttribute>
}

const fetchTokenIdsFromFilter = async (address: string, settings: ItemListingSettings) => {
  const filterObject: Record<string, NftAttribute> = settings.nftFilters
  const attrParams = Object.values(filterObject).reduce(
    (accum, attr) => ({
      ...accum,
      [attr.traitType]: attr.value,
    }),
    {},
  )
  const attrFilters = !isEmpty(attrParams) ? await fetchNftsFiltered(address, attrParams) : null
  return attrFilters ? Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId) : null
}

const fetchMarketDataNfts = async (
  address: string,
  settings: ItemListingSettings,
  page: number,
): Promise<NftToken[]> => {
  const tokenIdsFromFilter = await fetchTokenIdsFromFilter(address, settings)
  const whereClause = tokenIdsFromFilter
    ? {
        collection: address.toLowerCase(),
        isTradable: true,
        tokenId_in: tokenIdsFromFilter,
      }
    : { collection: address.toLowerCase(), isTradable: true }
  const subgraphRes = await getNftsMarketData(
    whereClause,
    REQUEST_SIZE,
    settings.field,
    settings.direction,
    page * REQUEST_SIZE,
  )
  const apiRequestPromises = subgraphRes.map((marketNft) => getNftApi(address, marketNft.tokenId))
  const apiResponses = await Promise.all(apiRequestPromises)
  const newNfts: NftToken[] = apiResponses.reduce((acc, apiNft) => {
    if (apiNft) {
      acc.push({
        ...apiNft,
        collectionAddress: address,
        collectionName: apiNft.collection.name,
        marketData: subgraphRes.find((marketNft) => marketNft.tokenId === apiNft.tokenId),
      })
    }
    return acc
  }, [] as NftToken[])
  return newNfts
}

const fetchAllNfts = async (address: string, settings: ItemListingSettings, page: number): Promise<NftToken[]> => {
  const tokenIdsFromFilter = await fetchTokenIdsFromFilter(address, settings)

  let collectionNftsResponse: ApiResponseCollectionTokens = null
  let tokenIds = null

  if (tokenIdsFromFilter) {
    tokenIds = tokenIdsFromFilter
  } else {
    collectionNftsResponse = await getNftsFromCollectionApi(address, REQUEST_SIZE, page)
    if (collectionNftsResponse?.data) {
      tokenIds = Object.values(collectionNftsResponse.data).map((nft) => nft.tokenId)
    }
  }

  if (tokenIds) {
    const nftsMarket = await getMarketDataForTokenIds(address, tokenIds)

    const responsesPromises = tokenIds.map(async (id) => {
      const apiMetadata: ApiSingleTokenData = collectionNftsResponse
        ? collectionNftsResponse.data[id]
        : await getNftApi(address, id)
      const marketData = nftsMarket.find((nft) => nft.tokenId === id)

      return {
        tokenId: id,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress: address,
        image: apiMetadata.image,
        attributes: apiMetadata.attributes,
        marketData,
      }
    })

    const newNfts: NftToken[] = await Promise.all(responsesPromises)
    return newNfts
  }
  return []
}

export const useCollectionNfts = (collectionAddress: string) => {
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    setItemListingSettings(() => ({
      field,
      direction,
      showOnlyNftsOnSale,
      nftFilters: JSON.parse(filtersJson),
    }))
  }, [field, direction, showOnlyNftsOnSale, filtersJson])

  const {
    data: nfts,
    status,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      return [collectionAddress, itemListingSettingsJson, pageIndex, 'collectionNfts']
    },
    (address, settingsJson, page) => {
      const settings: ItemListingSettings = JSON.parse(settingsJson)
      if (settings.showOnlyNftsOnSale || settings.field !== 'tokenId') {
        return fetchMarketDataNfts(address, settings, page)
      }
      return fetchAllNfts(address, settings, page)
    },
    { revalidateAll: true },
  )

  return {
    nfts: nfts ? uniqBy(nfts.flat(), 'tokenId') : [],
    isFetchingNfts: status !== FetchStatus.Fetched,
    size,
    setSize,
    showOnlyNftsOnSale,
    orderField: field,
    nftFilters,
  }
}
