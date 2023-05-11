import { useContractRead } from 'wagmi'
import { useChainlinkOracleContract } from 'hooks/useContract'
import { useConfig } from '../context/ConfigProvider'

const usePollOraclePrice = () => {
  const { chainlinkOracleAddress } = useConfig()

  const chainlinkOracleContract = useChainlinkOracleContract(chainlinkOracleAddress, false)

  const { data: price, refetch } = useContractRead({
    abi: chainlinkOracleContract?.abi,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
  })

  return { price, refresh: refetch }
}

export default usePollOraclePrice
