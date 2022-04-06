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
import { getNftMarketContract } from '../../../../utils/contractHelpers'
import { NOT_ON_SALE_SELLER } from '../../../../config/constants'
import { formatBigNumber } from '../../../../utils/formatBalance'

const fetchMarketDataNfts = async (
  account: string,
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
  return { newNfts: moreTokensWithRequestedBunnyId, isPageLast: moreTokensWithRequestedBunnyId.length < itemsPerPage }
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
      const nftMarketContract = getNftMarketContract()
      const { newNfts, isPageLast } = await fetchMarketDataNfts(
        account,
        id,
        nftMetadata,
        sortDirection,
        page,
        itemsPerPage,
      )
      isLastPage.current = isPageLast
      const nftsMarketTokenIds = newNfts.map((marketData) => marketData.tokenId)
      const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(
        pancakeBunniesAddress.toLowerCase(),
        nftsMarketTokenIds,
      )
      const askInfo = response?.askInfo
      if (!askInfo) return newNfts

      return askInfo
        .map((tokenAskInfo, index) => {
          if (!tokenAskInfo.seller || !tokenAskInfo.price) return null
          const currentSeller = tokenAskInfo.seller
          const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
          if (!isTradable) return null

          return {
            tokenId: nftsMarketTokenIds[index],
            currentSeller,
            currentAskPrice: tokenAskInfo.price,
          }
        })
        .filter((tokenUpdatedPrice) => {
          return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice.gt(0)
        })
        .sort((askInfoA, askInfoB) => {
          return askInfoA.currentAskPrice.gt(askInfoB.currentAskPrice)
            ? 1 * (sortDirection === 'desc' ? -1 : 1)
            : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
            ? 0
            : -1 * (sortDirection === 'desc' ? -1 : 1)
        })
        .map(({ tokenId, currentSeller, currentAskPrice }) => {
          const nftData = newNfts.find((marketData) => marketData.tokenId === tokenId)
          return {
            ...nftData,
            marketData: { ...nftData.marketData, currentSeller, currentAskPrice: formatBigNumber(currentAskPrice) },
          }
        })
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
