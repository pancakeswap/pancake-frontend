import { Percent } from '@pancakeswap/swap-sdk-core'
import { pancakeV3PoolABI } from '@pancakeswap/v3-sdk'
import { useReadContract } from '@pancakeswap/wagmi'
import { stableSwapABI } from 'config/abi/stableSwapAbi'
import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { PoolProtocol } from 'state/info/types'
import { Address } from 'viem'

const STABLE_POOL_FEE_DENOMINATOR = BigInt(1e10)
const v2Fee = new Percent(10000 - 9975, 10000)

export const usePoolFee = (poolAddress: Address | undefined, poolProtocol: PoolProtocol) => {
  const chainId = useChainIdByQuery()
  const isV2 = useMemo(() => poolProtocol === 'v2', [poolProtocol])
  const enabled = useMemo(() => {
    return Boolean(poolAddress) && !isV2
  }, [isV2, poolAddress])
  const { data, isLoading } = useReadContract({
    query: {
      enabled,
    },
    chainId,
    abi: enabled ? pancakeV3PoolABI : stableSwapABI,
    address: poolAddress!,
    functionName: 'fee',
  })

  return {
    fee: isV2 ? v2Fee : new Percent(data ?? 0n, poolProtocol === 'stable' ? STABLE_POOL_FEE_DENOMINATOR : 1e6),
    isLoading,
  }
}
