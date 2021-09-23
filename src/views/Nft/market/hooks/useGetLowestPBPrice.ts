import { useEffect, useState } from 'react'
import { getNftsMarketData } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'

export interface LowestPBNftPrice {
  isFetching: boolean
  lowestPrice: number
}

/**
 * A temporary hook to get the bunny id from the attributes. Even though we know the nft is from
 * Pancake Bunnies this helper will make sure it doesn't throw an error
 * @TODO: Revisit this once we get additional collections
 */
export const useGetLowestPriceFromNft = (nft: NftToken) => {
  const bunnyIdAttr = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')
  return useGetLowestPBNftPrice(bunnyIdAttr.value.toString())
}

const useGetLowestPBNftPrice = (bunnyId: string): LowestPBNftPrice => {
  const [isFetching, setIsFetching] = useState(false)
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
  }, [bunnyId, setIsFetching, setLowestPrice])

  return { isFetching, lowestPrice }
}

export default useGetLowestPBNftPrice
