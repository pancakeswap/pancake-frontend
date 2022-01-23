import { FetchStatus } from 'config/constants/types'
import { getNftsMarketData } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import useSWR from 'swr'
import { pancakeBunniesAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getBunnyIdFromNft = (nft: NftToken): string => {
  const bunnyId = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')?.value
  return bunnyId ? bunnyId.toString() : null
}

export const useGetLowestPriceFromBunnyId = (bunnyId?: string): LowestNftPrice => {
  const { data, status } = useSWR(bunnyId ? ['bunnyLowestPrice', bunnyId] : null, async () => {
    const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 1, 'currentAskPrice', 'asc')

    if (response.length > 0) {
      const [tokenMarketData] = response
      return parseFloat(tokenMarketData.currentAskPrice)
    }
    return null
  })

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  const isPancakeBunny = nft.collectionAddress?.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  const bunnyIdAttr = isPancakeBunny && getBunnyIdFromNft(nft)

  return useGetLowestPriceFromBunnyId(bunnyIdAttr)
}
