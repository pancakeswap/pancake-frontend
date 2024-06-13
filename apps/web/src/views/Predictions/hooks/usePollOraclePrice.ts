import { ChainId } from '@pancakeswap/chains'
import { useReadContract } from '@pancakeswap/wagmi'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useGaletoOraclePrice } from './useGaletoOraclePrice'

interface UsePollOraclePriceProps {
  chainlinkOracleAddress?: Address
  galetoOracleAddress?: Address
}

const usePollOraclePrice = ({ chainlinkOracleAddress, galetoOracleAddress }: UsePollOraclePriceProps) => {
  const { chainId } = useActiveChainId()

  const shouldFetchGaletoPrice = useMemo(
    () => Boolean(galetoOracleAddress && chainId === ChainId.ZKSYNC),
    [galetoOracleAddress, chainId],
  )

  const { data: chainlinkOraclePrice = 0n, refetch: refetchChainlinkOraclePrice } = useReadContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    chainId,
    query: {
      enabled: !shouldFetchGaletoPrice,
    },
    watch: !shouldFetchGaletoPrice,
  })

  const { galetoOraclePrice, refetchGaletoOraclePrice } = useGaletoOraclePrice({
    address: galetoOracleAddress,
    enabled: shouldFetchGaletoPrice,
  })

  return {
    price: shouldFetchGaletoPrice ? galetoOraclePrice : chainlinkOraclePrice,
    refresh: shouldFetchGaletoPrice ? refetchGaletoOraclePrice : refetchChainlinkOraclePrice,
  }
}

export default usePollOraclePrice
