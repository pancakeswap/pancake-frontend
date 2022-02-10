import { useChainlinkOracleContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'
import { Zero } from '@ethersproject/constants'

const usePollOraclePrice = (seconds = 10) => {
  const chainlinkOracleContract = useChainlinkOracleContract()
  const { data: price = Zero } = useSWRContract([chainlinkOracleContract, 'latestAnswer'], {
    refreshInterval: seconds * 1000,
    refreshWhenHidden: true,
    refreshWhenOffline: true,
  })

  return price
}

export default usePollOraclePrice
