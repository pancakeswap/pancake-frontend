import { useEffect, useState, useRef } from 'react'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
  getNftsUpdatedMarketData,
} from 'state/nftMarket/helpers'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { safeGetAddress } from 'utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { pancakeBunniesAddress } from '../constants'

const fetchMarketDataNfts = async (
  bunnyId: string,
  nftMetadata: ApiResponseCollectionTokens,
  direction: 'asc' | 'desc',
  page: number,
  itemsPerPage: number,
): Promise<{ newNfts: NftToken[]; isPageLast: boolean }> => {
  const whereClause = {
    collection: pancakeBunniesAddress.toLowerCase(),
    otherId: bunnyId,
    isTradable: true,
  }
  const nftsMarket = await getNftsMarketData(
    whereClause,
    itemsPerPage,
    'currentAskPrice',
    direction,
    page * itemsPerPage,
  )

  const moreTokensWithRequestedBunnyId = nftsMarket.map((marketData) => {
    const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
    const attributes = getPancakeBunniesAttributesField(marketData.otherId)
    return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
  })
  return { newNfts: moreTokensWithRequestedBunnyId, isPageLast: moreTokensWithRequestedBunnyId.length < itemsPerPage }
}

export const usePancakeBunnyOnSaleNfts = (
  bunnyId: string,
  nftMetadata: ApiResponseCollectionTokens,
  itemsPerPage: number,
) => {
  const isLastPage = useRef(false)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc' as const)

  useEffect(() => {
    isLastPage.current = false
  }, [direction])

  const {
    data: nfts,
    status,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [bunnyId, direction, 'pancakeBunnyOnSaleNfts'],
    queryFn: async ({ pageParam }) => {
      const { newNfts, isPageLast } = await fetchMarketDataNfts(
        bunnyId,
        nftMetadata,
        direction,
        pageParam,
        itemsPerPage,
      )
      isLastPage.current = isPageLast
      const nftsMarketTokenIds = newNfts.map((marketData) => marketData.tokenId)
      const updatedMarketData = await getNftsUpdatedMarketData(pancakeBunniesAddress, nftsMarketTokenIds)
      if (!updatedMarketData) return { data: newNfts, pageParam }

      const nftsWithMarketData = updatedMarketData
        .sort((askInfoA, askInfoB) => {
          return askInfoA.currentAskPrice > askInfoB.currentAskPrice
            ? 1 * (direction === 'desc' ? -1 : 1)
            : askInfoA.currentAskPrice === askInfoB.currentAskPrice
            ? 0
            : -1 * (direction === 'desc' ? -1 : 1)
        })
        .map(({ tokenId, currentSeller, currentAskPrice }) => {
          const nftData = newNfts.find((marketData) => marketData.tokenId === tokenId)
          const isTradable = safeGetAddress(currentSeller) !== NOT_ON_SALE_SELLER
          return {
            ...nftData,
            marketData: {
              ...nftData?.marketData,
              isTradable,
              currentSeller: isTradable ? currentSeller.toLowerCase() : nftData?.marketData?.currentSeller,
              currentAskPrice: isTradable ? formatBigInt(currentAskPrice) : nftData?.marketData?.currentAskPrice,
            },
          }
        })

      return { data: nftsWithMarketData, pageParam }
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
    refetchInterval: 10000,
  })

  return {
    nfts: nfts?.pages?.map((page) => page.data) || [],
    refresh: refetch,
    isFetchingNfts: status !== 'success',
    page: (nfts?.pageParams?.[nfts?.pageParams?.length - 1] as number) || 0,
    fetchNextPage,
    direction,
    setDirection,
    isLastPage: isLastPage.current,
    isValidating: isRefetching,
  }
}
