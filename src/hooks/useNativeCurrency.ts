import { Native, NativeCurrency, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from './useActiveWeb3React'

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => Native.onChain(chainId), [chainId])
}
