import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import { LowestNftPrice, NftToken } from 'hooks/useProfile/nft/types'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { pancakeBunniesAddress } from 'views/ProfileCreation/Nft/constants'
import { getNftsMarketData } from '../utils/getNftsMarketData'
import { getNftsUpdatedMarketData } from '../utils/getNftsUpdatedMarketData'

const getBunnyIdFromNft = (nft: NftToken): string | undefined => {
  const bunnyId = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')?.value
  return bunnyId ? bunnyId.toString() : undefined
}

export const getLowestUpdatedToken = async (collectionAddress: Address, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress, nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice > 0 && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 1
        : askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 0
        : -1
    })[0]
}

export const useGetLowestPriceFromBunnyId = (bunnyId?: string): LowestNftPrice => {
  const { data, status } = useQuery({
    queryKey: ['bunnyLowestPrice', bunnyId],
    queryFn: async () => {
      const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 100, 'currentAskPrice', 'asc')

      if (!response.length) return undefined

      const nftsMarketTokenIds = response.map((marketData) => marketData.tokenId)
      const lowestPriceUpdatedBunny = await getLowestUpdatedToken(pancakeBunniesAddress, nftsMarketTokenIds)

      if (lowestPriceUpdatedBunny) {
        return parseFloat(formatBigInt(lowestPriceUpdatedBunny.currentAskPrice))
      }
      return undefined
    },
    enabled: Boolean(bunnyId),
  })

  return { isFetching: status !== 'success', lowestPrice: data }
}

export const useGetLowestPriceFromNft = (nft?: NftToken): LowestNftPrice => {
  const isPancakeBunny = safeGetAddress(nft?.collectionAddress) === safeGetAddress(pancakeBunniesAddress)

  const bunnyIdAttr = isPancakeBunny && nft ? getBunnyIdFromNft(nft) : undefined

  return useGetLowestPriceFromBunnyId(bunnyIdAttr)
}
