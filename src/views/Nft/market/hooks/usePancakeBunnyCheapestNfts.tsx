import { useWeb3React } from '@web3-react/core'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import useSWR from 'swr'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import { FAST_INTERVAL, NOT_ON_SALE_SELLER } from 'config/constants'
import { FetchStatus } from 'config/constants/types'
import { getNftMarketContract } from 'utils/contractHelpers'
import { formatBigNumber } from 'utils/formatBalance'
import { pancakeBunniesAddress } from '../constants'

type WhereClause = Record<string, string | number | boolean | string[]>

const fetchCheapestBunny = async (
  whereClause: WhereClause = {},
  nftMetadata: ApiResponseCollectionTokens,
): Promise<NftToken> => {
  const nftMarketContract = getNftMarketContract()
  const nftsMarket = await getNftsMarketData(whereClause, 100, 'currentAskPrice', 'asc')

  if (!nftsMarket.length) return null

  const nftsMarketTokenIds = nftsMarket.map((marketData) => marketData.tokenId)
  const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(
    pancakeBunniesAddress.toLowerCase(),
    nftsMarketTokenIds,
  )
  const askInfo = response?.askInfo

  if (!askInfo) return null

  const lowestPriceUpdatedBunny = askInfo
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
        ? 1
        : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
        ? 0
        : -1
    })[0]

  const cheapestBunnyOfAccount = nftsMarket
    .filter((marketData) => marketData.tokenId === lowestPriceUpdatedBunny?.tokenId)
    .map((marketData) => {
      const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
      const attributes = getPancakeBunniesAttributesField(marketData.otherId)
      const bunnyToken = combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      const updatedPrice = formatBigNumber(lowestPriceUpdatedBunny.currentAskPrice)
      return {
        ...bunnyToken,
        marketData: { ...bunnyToken.marketData, ...lowestPriceUpdatedBunny, currentAskPrice: updatedPrice },
      }
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
