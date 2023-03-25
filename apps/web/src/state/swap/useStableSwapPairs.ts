import { stableSwapPairsByChainId } from '@pancakeswap/smart-router/evm'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'

export function useStableSwapPairs() {
  const { chainId } = useActiveChainId()

  return useMemo(() => stableSwapPairsByChainId[chainId] || [], [chainId])
}
