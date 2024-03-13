import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useInfiniteQuery } from '@tanstack/react-query'
import fromPairs from 'lodash/fromPairs'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchNftsFiltered,
  getMarketDataForTokenIds,
  getNftApi,
  getNftsFromCollectionApi,
  getNftsMarketData,
} from 'state/nftMarket/helpers'
import { useGetCollection, useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import { ApiResponseCollectionTokens, Collection, NftAttribute, NftToken } from 'state/nftMarket/types'
import { REQUEST_SIZE } from '../Collection/config'

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  nftFilters: Record<string, NftAttribute>
}

const fetchTokenIdsFromFilter = async (address: string, settings: ItemListingSettings) => {
  const filterObject: Record<string, NftAttribute> = settings.nftFilters
  const attrParams = fromPairs(
    Object.values(filterObject)
      .filter((attr) => !isUndefinedOrNull(attr.value))
      .map((attr) => [attr.traitType, attr.value as string | number]),
  )
  const attrFilters = !isEmpty(attrParams) ? await fetchNftsFiltered(address, attrParams) : null
  return attrFilters
    ? (Object.values(attrFilters.data)
        .map((apiToken) => apiToken.tokenId)
        .filter(Boolean) as string[])
    : null
}

const fetchMarketDataNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
  tokenIdsFromFilter: string[] | null,
): Promise<NftToken[]> => {
  const whereClause = tokenIdsFromFilter
    ? {
        collection: collection.address.toLowerCase(),
        isTradable: true,
        tokenId_in: tokenIdsFromFilter,
      }
    : { collection: collection.address.toLowerCase(), isTradable: true }
  const subgraphRes = await getNftsMarketData(
    whereClause,
    REQUEST_SIZE,
    settings.field,
    settings.direction,
    page * REQUEST_SIZE,
  )

  const apiRequestPromises = subgraphRes.map((marketNft) => getNftApi(collection.address, marketNft.tokenId))
  const apiResponses = await Promise.all(apiRequestPromises)
  const newNfts: NftToken[] = apiResponses.reduce((acc, apiNft) => {
    if (apiNft) {
      acc.push({
        ...apiNft,
        collectionAddress: collection.address,
        collectionName: apiNft.collection.name,
        marketData: subgraphRes.find((marketNft) => marketNft.tokenId === apiNft.tokenId),
      })
    }
    return acc
  }, [] as NftToken[])
  return newNfts
}

const tokenIdsFromFallback = (
  collection: Collection,
  tokenIdsFromFilter: string[] | null,
  fetchedNfts: NftToken[],
  fallbackPage: number,
): string[] => {
  let tokenIds: string[] = []
  const startIndex = fallbackPage * REQUEST_SIZE
  const endIndex = (fallbackPage + 1) * REQUEST_SIZE
  if (tokenIdsFromFilter) {
    tokenIds = tokenIdsFromFilter
      .filter((tokenId) => !fetchedNfts.some((fetchedNft) => fetchedNft.tokenId === tokenId))
      .slice(startIndex, endIndex)
  } else {
    const totalSupply = parseInt(collection?.totalSupply)
    let counter = startIndex
    let index = startIndex
    while (counter < endIndex) {
      if (index > totalSupply) {
        break
      }
      // eslint-disable-next-line no-loop-func
      if (!fetchedNfts.some((fetchedNft) => parseInt(fetchedNft.tokenId) === index)) {
        tokenIds.push(index.toString())
        counter++
      }
      index++
    }
  }
  return tokenIds
}

const fetchAllNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
  tokenIdsFromFilter: string[] | null,
  fetchedNfts: NftToken[],
  nftFallbackMode: boolean,
  nftFallbackPage: number,
): Promise<{ nfts: NftToken[]; fallbackMode: boolean; fallbackPage: number }> => {
  const newNfts: NftToken[] = []
  let tokenIds: string[] = []
  let collectionNftsResponse: ApiResponseCollectionTokens | null = null
  let fallbackMode = nftFallbackMode
  let fallbackPage = nftFallbackPage
  if (settings.field !== 'tokenId' && !fallbackMode) {
    const marketDataNfts = await fetchMarketDataNfts(collection, settings, page, tokenIdsFromFilter)
    if (marketDataNfts.length) {
      newNfts.push(...marketDataNfts)
    }
    if (newNfts.length < REQUEST_SIZE) {
      // eslint-disable-next-line no-param-reassign
      fallbackMode = true
      fetchedNfts.push(...newNfts)
    } else {
      return { nfts: newNfts, fallbackMode, fallbackPage }
    }
  }

  if (fallbackMode) {
    tokenIds = tokenIdsFromFallback(collection, tokenIdsFromFilter, fetchedNfts, fallbackPage)
    // eslint-disable-next-line no-param-reassign
    fallbackPage += 1
  } else if (tokenIdsFromFilter) {
    tokenIds = tokenIdsFromFilter.slice(page * REQUEST_SIZE, (page + 1) * REQUEST_SIZE)
  } else {
    collectionNftsResponse = await getNftsFromCollectionApi(collection.address, REQUEST_SIZE, page + 1)
    if (collectionNftsResponse?.data) {
      tokenIds = Object.values(collectionNftsResponse.data)
        .map((nft) => nft.tokenId)
        .filter(Boolean) as string[]
    }
  }

  if (tokenIds.length) {
    const nftsMarket = await getMarketDataForTokenIds(collection.address, tokenIds)

    const responsesPromises = tokenIds.map(async (id) => {
      const apiMetadata = collectionNftsResponse
        ? collectionNftsResponse.data[id]
        : await getNftApi(collection.address, id)
      if (apiMetadata) {
        const marketData = nftsMarket.find((nft) => nft.tokenId === id)

        return {
          tokenId: id,
          name: apiMetadata.name,
          description: apiMetadata.description,
          collectionName: apiMetadata.collection.name,
          collectionAddress: collection.address,
          image: apiMetadata.image,
          attributes: apiMetadata.attributes,
          marketData,
        }
      }
      return null
    })

    const responseNfts: NftToken[] = (await Promise.all(responsesPromises)).filter(Boolean) as NftToken[]
    newNfts.push(...responseNfts)
    return { nfts: newNfts, fallbackMode, fallbackPage }
  }
  return { nfts: [], fallbackMode, fallbackPage }
}

export const useCollectionNfts = (collectionAddress?: string) => {
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const collection = useGetCollection(collectionAddress)
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  // We don't know the amount in advance if nft filters exist
  const resultSize =
    !Object.keys(nftFilters).length && collection
      ? showOnlyNftsOnSale
        ? collection.numberTokensListed
        : collection?.totalSupply
      : null

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    setItemListingSettings(() => ({
      field,
      direction,
      showOnlyNftsOnSale,
      nftFilters: JSON.parse(filtersJson),
    }))
    fallbackMode.current = false
    fallbackModePage.current = 0
    fetchedNfts.current = []
    isLastPage.current = false
  }, [field, direction, showOnlyNftsOnSale, filtersJson])

  const {
    data: nfts,
    status,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [collectionAddress, itemListingSettingsJson, 'collectionNfts'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const settings: ItemListingSettings = JSON.parse(itemListingSettingsJson)
      const tokenIdsFromFilter = collection?.address ? await fetchTokenIdsFromFilter(collection?.address, settings) : []
      let newNfts: NftToken[] = []
      if (collection) {
        if (settings.showOnlyNftsOnSale) {
          newNfts = await fetchMarketDataNfts(collection, settings, pageParam, tokenIdsFromFilter)
        } else {
          const {
            nfts: allNewNfts,
            fallbackMode: newFallbackMode,
            fallbackPage: newFallbackPage,
          } = await fetchAllNfts(
            collection,
            settings,
            pageParam,
            tokenIdsFromFilter,
            fetchedNfts.current,
            fallbackMode.current,
            fallbackModePage.current,
          )
          newNfts = allNewNfts
          fallbackMode.current = newFallbackMode
          fallbackModePage.current = newFallbackPage
        }
      }
      if (newNfts.length < REQUEST_SIZE) {
        isLastPage.current = true
      }
      return { data: newNfts, pageParam }
    },
    getNextPageParam: (lastPage) => {
      if (isLastPage.current) {
        return undefined
      }
      return lastPage.pageParam + 1
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.pageParam === 1) {
        return undefined
      }
      return firstPage.pageParam - 1
    },
  })

  const uniqueNftList: NftToken[] = useMemo(() => {
    return uniqBy(nfts?.pages?.map((page) => page.data).flat() || [], 'tokenId')
  }, [nfts])
  fetchedNfts.current = uniqueNftList

  return {
    nfts: uniqueNftList,
    isFetchingNfts: status !== 'success',
    fetchNextPage,
    resultSize,
    isLastPage: isLastPage.current,
  }
}
