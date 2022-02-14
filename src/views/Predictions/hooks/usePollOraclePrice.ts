import { useChainlinkOracleContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'
import { Zero } from '@ethersproject/constants'

const usePollOraclePrice = (seconds = 10) => {
  const chainlinkOracleContract = useChainlinkOracleContract(false)
  // Can refactor to subscription later
  const { data: price } = useSWRContract([chainlinkOracleContract, 'latestAnswer'], {
    refreshInterval: seconds * 1000,
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    dedupingInterval: seconds * 1000,
    fallbackData: Zero,
  })

  return price
}

export default usePollOraclePrice
