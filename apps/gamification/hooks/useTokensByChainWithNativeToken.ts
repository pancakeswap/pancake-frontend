import { ChainId } from '@pancakeswap/chains'
import { getTokensByChain } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'

export const useTokensByChainWithNativeToken = (chainId: ChainId) => {
  const list = getTokensByChain(chainId)
  const nativeToken = useNativeCurrency(chainId)

  const filterTokens = useMemo(() => {
    if (chainId === ChainId.BSC) {
      // BSC token list has one token same as native token.
      return list.filter((i) => !i.isNative && i.symbol !== nativeToken.symbol)
    }
    return list
  }, [chainId, list, nativeToken])

  const tokens = useMemo(() => [nativeToken, ...filterTokens], [filterTokens, nativeToken])

  return tokens
}
