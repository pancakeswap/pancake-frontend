import { ChainId } from '@pancakeswap/chains'
import { galetoOracleABI } from '@pancakeswap/prediction'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useContractRead } from 'wagmi'

interface UsePollOraclePriceProps {
  chainlinkOracleAddress?: Address
  galetoOracleAddress?: Address
}

const usePollOraclePrice = ({ chainlinkOracleAddress, galetoOracleAddress }: UsePollOraclePriceProps) => {
  const { chainId } = useActiveChainId()

  const shouldUseGaletoPrice = useMemo(
    () => Boolean(galetoOracleAddress && chainId === ChainId.ZKSYNC),
    [galetoOracleAddress, chainId],
  )

  const { data: chainlinkOraclePrice = 0n, refetch: refetchChainlinkOraclePrice } = useContractRead({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
    chainId,
    enabled: !shouldUseGaletoPrice,
  })

  const { data: galetoOraclePrice = 0n, refetch: refetchGaletoOraclePrice } = useContractRead({
    abi: galetoOracleABI,
    address: '0x48F3aAeBea55c80aB7815D829C9B48D57c1b3bab',
    functionName: 'latestAnswer',
    watch: true,
    chainId: ChainId.ZKSYNC,
    enabled: shouldUseGaletoPrice,
  })

  return {
    price: shouldUseGaletoPrice ? galetoOraclePrice : chainlinkOraclePrice,
    refresh: shouldUseGaletoPrice ? refetchGaletoOraclePrice : refetchChainlinkOraclePrice,
  }
}

export default usePollOraclePrice
