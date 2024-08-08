import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { NativeCurrency } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

export default function useNativeCurrency(overrideChainId?: ChainId): NativeCurrency {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    try {
      return Native.onChain(overrideChainId ?? chainId ?? ChainId.BSC)
    } catch (e) {
      return Native.onChain(ChainId.BSC)
    }
  }, [overrideChainId, chainId])
}
