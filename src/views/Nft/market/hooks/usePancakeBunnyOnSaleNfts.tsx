import { useWeb3React } from '@web3-react/core'
import { useEffect, useState, useRef } from 'react'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import { pancakeBunniesAddress } from '../constants'
import { FetchStatus } from '../../../../config/constants/types'

const fetchMarketDataNfts = async (
  account: string,
  bunnyId: string,
  nftMetadata: ApiResponseCollectionTokens,
  direction: 'asc' | 'desc',
  page: number,
  itemsPerPage: number,
): Promise<NftToken[]> => {
  const whereClause = {
    collection: pancakeBunniesAddress.toLowerCase(),
    otherId: bunnyId,
    isTradable: true,
    ...(account ? { currentSeller_not: account.toLowerCase() } : {}),
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
  return moreTokensWithRequestedBunnyId
}

export const usePancakeBunnyOnSaleNfts = (
  bunnyId: string,
  nftMetadata: ApiResponseCollectionTokens,
  itemsPerPage: number,
) => {
  const { account } = useWeb3React()
  const isLastPage = useRef(false)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc' as const)

  useEffect(() => {
    isLastPage.current = false
  }, [direction])

  const {
    data: nfts,
    status,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (!nftMetadata) return null
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      if (account) {
        return [bunnyId, direction, pageIndex, account, 'pancakeBunnyOnSaleNfts']
      }
      return [bunnyId, direction, pageIndex, 'pancakeBunnyOnSaleNfts']
    },
    async (id, sortDirection, page) => {
      const newNfts: NftToken[] = await fetchMarketDataNfts(account, id, nftMetadata, sortDirection, page, itemsPerPage)
      if (newNfts.length < itemsPerPage) {
        isLastPage.current = true
      }
      return newNfts
    },
    {
      refreshInterval: 10000,
      revalidateAll: true,
    },
  )

  return {
    nfts,
    refresh: mutate,
    isFetchingNfts: status !== FetchStatus.Fetched,
    page: size,
    setPage: setSize,
    direction,
    setDirection,
    isLastPage: isLastPage.current,
    isValidating,
  }
}
