import { ChainId } from '@pancakeswap/chains'
import { getTokensByChain } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'

export const useTokensByChainWithNativeToken = (chainId: ChainId) => {
  const list = getTokensByChain(chainId)
  const nativeToken = useNativeCurrency(chainId)
  const tokens = useMemo(() => [nativeToken, ...list], [list, nativeToken])

  const filterTokens = useMemo(() => {
    if (chainId === ChainId.BSC) {
      // BSC token list has one token same as native token.
      return tokens.filter((i) => !i.isNative || (i.isNative && nativeToken.symbol !== i.symbol))
    }
    return tokens
  }, [chainId, nativeToken, tokens])

  return filterTokens
}
