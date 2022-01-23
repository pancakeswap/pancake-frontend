import { FetchStatus } from 'config/constants/types'
import { useEffect, useState } from 'react'
import { getNftsMarketData } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import useSWR from 'swr'
import { pancakeBunniesAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getBunnyIdFromNftAttrs = (nftAttrs?: NftToken['attributes']): string => {
  const bunnyId = nftAttrs?.find((attr) => attr.traitType === 'bunnyId')?.value
  return bunnyId ? bunnyId.toString() : null
}

export const useGetLowestPriceFromBunnyId = (bunnyId: string): LowestNftPrice => {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [lowestPrice, setLowestPrice] = useState<number>(null)

  useEffect(() => {
    const fetchLowestPrice = async () => {
      try {
        setIsFetching(true)
        const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 1, 'currentAskPrice', 'asc')

        if (response.length > 0) {
          const [tokenMarketData] = response
          setLowestPrice(parseFloat(tokenMarketData.currentAskPrice))
        }
      } finally {
        setIsFetching(false)
      }
    }

    if (bunnyId) {
      fetchLowestPrice()
    }
  }, [bunnyId])

  return { isFetching, lowestPrice }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  const isPancakeBunny = nft.collectionAddress?.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  const { data, status } = useSWR(
    // TODO: looks like it is refetching every time, the nft ref changes from list
    isPancakeBunny && nft.attributes ? ['lowestPriceFromNft', nft.attributes] : null,
    async () => {
      const bunnyIdAttr = getBunnyIdFromNftAttrs(nft.attributes)
      const response = await getNftsMarketData({ otherId: bunnyIdAttr, isTradable: true }, 1, 'currentAskPrice', 'asc')

      if (response.length > 0) {
        const [tokenMarketData] = response
        return parseFloat(tokenMarketData.currentAskPrice)
      }
      return null
    },
  )

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data }
}
