import { useEffect, useState } from 'react'
import { getNftsMarketData } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { pancakeBunniesAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getBunnyIdFromNft = (nft: NftToken): string => {
  const bunnyId = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')?.value
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
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [lowestPrice, setLowestPrice] = useState<number>(null)
  const isPancakeBunny = nft.collectionAddress?.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  useEffect(() => {
    const fetchLowestPrice = async () => {
      const bunnyIdAttr = getBunnyIdFromNft(nft)
      try {
        setIsFetching(true)
        const response = await getNftsMarketData(
          { otherId: bunnyIdAttr, isTradable: true },
          1,
          'currentAskPrice',
          'asc',
        )

        if (response.length > 0) {
          const [tokenMarketData] = response
          setLowestPrice(parseFloat(tokenMarketData.currentAskPrice))
        }
      } finally {
        setIsFetching(false)
      }
    }

    if (isPancakeBunny && nft) {
      fetchLowestPrice()
    }
  }, [isPancakeBunny, nft])

  return { isFetching, lowestPrice }
}
