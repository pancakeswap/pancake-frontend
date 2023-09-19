import { Native, NativeCurrency } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    try {
      return Native.onChain(chainId)
    } catch (e) {
      return Native.onChain(ChainId.BSC)
    }
  }, [chainId])
}
