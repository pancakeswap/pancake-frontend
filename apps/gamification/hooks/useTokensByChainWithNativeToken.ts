import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { getTokensByChain } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'

export const useTokensByChainWithNativeToken = (chainId: ChainId) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seen = new Set()
  const list = getTokensByChain(chainId)
  const nativeToken = useNativeCurrency(chainId)
  const tokens = useMemo(() => [nativeToken, ...list], [list, nativeToken])

  const filteredArr = useMemo(() => {
    return tokens.filter((token) => {
      const address = token.isNative ? token.wrapped.address?.toLowerCase() : token.address.toLowerCase()
      const duplicate = seen.has(address)
      seen.add(address)
      return !duplicate
    })
  }, [seen, tokens])

  return useMemo((): Currency[] => filteredArr, [filteredArr])
}
