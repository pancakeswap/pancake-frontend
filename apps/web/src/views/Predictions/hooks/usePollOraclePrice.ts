import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContractRead } from 'wagmi'
import { useChainlinkOracleContract } from 'hooks/useContract'
import { useConfig } from '../context/ConfigProvider'

const usePollOraclePrice = () => {
  const { chainlinkOracleAddress } = useConfig()

  const chainlinkOracleContract = useChainlinkOracleContract(chainlinkOracleAddress)
  const { chainId } = useActiveChainId()

  const { data: price = 0n, refetch } = useContractRead({
    abi: chainlinkOracleContract?.abi,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
    chainId,
  })

  return { price, refresh: refetch }
}

export default usePollOraclePrice
