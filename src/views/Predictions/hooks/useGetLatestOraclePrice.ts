import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useLastUpdated from 'hooks/useLastUpdated'
import { getBalanceAmount } from 'utils/formatBalance'
import { getChainlinkOracleContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

const useGetLatestOraclePrice = () => {
  const [price, setPrice] = useState(BIG_ZERO)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()

  useEffect(() => {
    const fetchPrice = async () => {
      const contract = getChainlinkOracleContract()
      const response = await contract.latestAnswer()
      setPrice(getBalanceAmount(new BigNumber(response.toString()), 8))
    }

    fetchPrice()
  }, [lastUpdated, setPrice])

  return { price, lastUpdated, refresh }
}

export default useGetLatestOraclePrice
