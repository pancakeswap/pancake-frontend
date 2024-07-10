import { ChainId } from '@pancakeswap/chains'
import { getTokensByChain } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'

export const useTokensByChainWithNativeToken = (chainId: ChainId) => {
  const list = getTokensByChain(chainId)
  const nativeToken = useNativeCurrency(chainId)
  const tokens = useMemo(() => [nativeToken, ...list], [list, nativeToken])

  return tokens
}
