import { useWeb3React } from '@web3-react/core'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import useSWR from 'swr'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import { pancakeBunniesAddress } from '../constants'
import { FAST_INTERVAL } from '../../../../config/constants'
import { FetchStatus } from '../../../../config/constants/types'

type WhereClause = Record<string, string | number | boolean | string[]>

const fetchCheapestBunny = async (
  whereClause: WhereClause = {},
  nftMetadata: ApiResponseCollectionTokens,
): Promise<NftToken> => {
  const nftsMarket = await getNftsMarketData(whereClause, 1, 'currentAskPrice', 'asc')

  const cheapestBunnyOfAccount = nftsMarket.map((marketData) => {
    const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
    const attributes = getPancakeBunniesAttributesField(marketData.otherId)
    return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
  })
  return cheapestBunnyOfAccount.length > 0 ? cheapestBunnyOfAccount[0] : null
}

export const usePancakeBunnyCheapestNft = (bunnyId: string, nftMetadata: ApiResponseCollectionTokens) => {
  const { data, status, mutate } = useSWR(
    nftMetadata && bunnyId ? ['cheapestBunny', bunnyId] : null,
    async () => {
      const whereClause = { collection: pancakeBunniesAddress.toLowerCase(), otherId: bunnyId, isTradable: true }

      return fetchCheapestBunny(whereClause, nftMetadata)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    data,
    isFetched: [FetchStatus.Failed, FetchStatus.Fetched].includes(status),
    refresh: mutate,
  }
}

export const usePBCheapestOtherSellersNft = (bunnyId: string, nftMetadata: ApiResponseCollectionTokens) => {
  const { account } = useWeb3React()
  const { data, status, mutate } = useSWR(
    account && nftMetadata && bunnyId ? ['cheapestOtherSellersBunny', bunnyId, account] : null,
    async () => {
      const whereClause = {
        collection: pancakeBunniesAddress.toLowerCase(),
        currentSeller_not: account.toLowerCase(),
        otherId: bunnyId,
        isTradable: true,
      }

      return fetchCheapestBunny(whereClause, nftMetadata)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    data,
    isFetched: [FetchStatus.Failed, FetchStatus.Fetched].includes(status),
    refresh: mutate,
  }
}
