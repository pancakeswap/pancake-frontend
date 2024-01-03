import { ChainId } from '@pancakeswap/chains'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useContractRead } from 'wagmi'
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

  const { data: chainlinkOraclePrice = 0n, refetch: refetchChainlinkOraclePrice } = useContractRead({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    watch: true,
    chainId,
    enabled: !shouldFetchGaletoPrice,
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
