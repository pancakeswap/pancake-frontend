import { FetchStatus } from 'config/constants/types'
import { getNftsMarketData, getNftsUpdatedMarketData } from 'state/nftMarket/helpers'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import { NftToken } from 'state/nftMarket/types'
import useSWR from 'swr'
import { isAddress } from 'utils'
import { pancakeBunniesAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getBunnyIdFromNft = (nft: NftToken): string => {
  const bunnyId = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')?.value
  return bunnyId ? bunnyId.toString() : null
}

export const getLowestUpdatedToken = async (collectionAddress: string, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress.toLowerCase(), nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice.gt(0) && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice.gt(askInfoB.currentAskPrice)
        ? 1
        : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
        ? 0
        : -1
    })[0]
}

export const useGetLowestPriceFromBunnyId = (bunnyId?: string): LowestNftPrice => {
  const { data, status } = useSWR(bunnyId ? ['bunnyLowestPrice', bunnyId] : null, async () => {
    const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 100, 'currentAskPrice', 'asc')

    if (!response.length) return null

    const nftsMarketTokenIds = response.map((marketData) => marketData.tokenId)
    const lowestPriceUpdatedBunny = await getLowestUpdatedToken(pancakeBunniesAddress.toLowerCase(), nftsMarketTokenIds)

    if (lowestPriceUpdatedBunny) {
      return parseFloat(formatBigNumber(lowestPriceUpdatedBunny.currentAskPrice))
    }
    return null
  })

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  const isPancakeBunny = isAddress(nft.collectionAddress) === pancakeBunniesAddress

  const bunnyIdAttr = isPancakeBunny && getBunnyIdFromNft(nft)

  return useGetLowestPriceFromBunnyId(bunnyIdAttr)
}
