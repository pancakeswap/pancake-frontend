import { useAccount } from 'wagmi'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import { FAST_INTERVAL } from 'config/constants'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import { pancakeBunniesAddress } from '../constants'
import { getLowestUpdatedToken } from './useGetLowestPrice'

type WhereClause = Record<string, string | number | boolean | string[]>

const fetchCheapestBunny = async (
  whereClause: WhereClause = {},
  nftMetadata: ApiResponseCollectionTokens,
): Promise<NftToken | null> => {
  const nftsMarket = await getNftsMarketData(whereClause, 100, 'currentAskPrice', 'asc')

  if (!nftsMarket.length) return null

  const nftsMarketTokenIds = nftsMarket.map((marketData) => marketData.tokenId)
  const lowestPriceUpdatedBunny = await getLowestUpdatedToken(pancakeBunniesAddress, nftsMarketTokenIds)

  const cheapestBunnyOfAccount = nftsMarket
    .filter((marketData) => marketData.tokenId === lowestPriceUpdatedBunny?.tokenId)
    .map((marketData) => {
      const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
      const attributes = getPancakeBunniesAttributesField(marketData.otherId)
      const bunnyToken = combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      const updatedPrice = formatBigInt(lowestPriceUpdatedBunny!.currentAskPrice)
      return {
        ...bunnyToken,
        marketData: { ...bunnyToken.marketData, ...lowestPriceUpdatedBunny, currentAskPrice: updatedPrice },
      }
    })
  return cheapestBunnyOfAccount.length > 0 ? cheapestBunnyOfAccount[0] : null
}

export const usePancakeBunnyCheapestNft = (bunnyId: string, nftMetadata: ApiResponseCollectionTokens) => {
  const { address: account } = useAccount()
  const { data, status, refetch } = useQuery({
    queryKey: ['cheapestBunny', bunnyId, account],
    queryFn: async () => {
      const allCheapestBunnyClause = {
        collection: pancakeBunniesAddress.toLowerCase(),
        otherId: bunnyId,
        isTradable: true,
      }
      if (!account) {
        return fetchCheapestBunny(allCheapestBunnyClause, nftMetadata)
      }

      const cheapestBunnyOtherSellersClause = {
        collection: pancakeBunniesAddress.toLowerCase(),
        currentSeller_not: account.toLowerCase(),
        otherId: bunnyId,
        isTradable: true,
      }
      const cheapestBunnyOtherSellers = await fetchCheapestBunny(cheapestBunnyOtherSellersClause, nftMetadata)
      return cheapestBunnyOtherSellers ?? fetchCheapestBunny(allCheapestBunnyClause, nftMetadata)
    },
    enabled: Boolean(nftMetadata && bunnyId),
    refetchInterval: FAST_INTERVAL,
  })

  return {
    data,
    isFetched: ['error', 'success'].includes(status),
    refresh: refetch,
  }
}
