import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContractRead } from 'wagmi'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useConfig } from '../context/ConfigProvider'

const usePollOraclePrice = () => {
  const { chainlinkOracleAddress } = useConfig()

  const { chainId } = useActiveChainId()

  const { data: price = 0n, refetch } = useContractRead({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
    chainId,
  })

  return { price, refresh: refetch }
}

export default usePollOraclePrice
