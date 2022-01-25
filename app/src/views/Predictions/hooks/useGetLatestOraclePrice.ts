import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import useLastUpdated from 'hooks/useLastUpdated'
import { getChainlinkOracleContract } from 'utils/contractHelpers'

const useGetLatestOraclePrice = () => {
  const [price, setPrice] = useState(BigNumber.from(0))
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
