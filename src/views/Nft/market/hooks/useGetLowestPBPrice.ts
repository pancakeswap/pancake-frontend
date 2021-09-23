import { useEffect, useState } from 'react'
import { getNftsMarketData } from 'state/nftMarket/helpers'

const useGetLowestPBNftPrice = (bunnyId: string) => {
  const [isFetching, setIsFetching] = useState(false)
  const [lowestPrice, setLowestPrice] = useState<number>(null)

  useEffect(() => {
    const fetchLowestPrice = async () => {
      const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 1, 'currentAskPrice', 'asc')

      if (response.length > 0) {
        const [tokenMarketData] = response
        setLowestPrice(parseFloat(tokenMarketData.currentAskPrice))
      }
    }

    fetchLowestPrice()
  }, [bunnyId, setIsFetching, setLowestPrice])

  return { isFetching, lowestPrice }
}

export default useGetLowestPBNftPrice
