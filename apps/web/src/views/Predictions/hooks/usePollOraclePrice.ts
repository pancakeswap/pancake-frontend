import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Address } from 'viem'
import { useContractRead } from 'wagmi'
import { useConfig } from '../context/ConfigProvider'

const usePollOraclePrice = (chainlinkOracleAddress?: Address) => {
  const config = useConfig()
  const { chainId } = useActiveChainId()

  const { data: price = 0n, refetch } = useContractRead({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress ?? config?.chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
    chainId,
    enabled: Boolean(chainlinkOracleAddress || config?.chainlinkOracleAddress),
  })

  return { price, refresh: refetch }
}

export default usePollOraclePrice
