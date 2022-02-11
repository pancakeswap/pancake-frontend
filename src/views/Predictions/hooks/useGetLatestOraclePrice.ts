import { useEffect, useState } from 'react'
import useLastUpdated from 'hooks/useLastUpdated'
import { getChainlinkOracleContract } from 'utils/contractHelpers'
import { Zero } from '@ethersproject/constants'

const useGetLatestOraclePrice = () => {
  const [price, setPrice] = useState(Zero)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()

  useEffect(() => {
    const fetchPrice = async () => {
      const contract = getChainlinkOracleContract()
      const response = await contract.latestAnswer()
      setPrice(response)
    }

    fetchPrice()
  }, [lastUpdated, setPrice])

  return { price, lastUpdated, refresh }
}

export default useGetLatestOraclePrice
