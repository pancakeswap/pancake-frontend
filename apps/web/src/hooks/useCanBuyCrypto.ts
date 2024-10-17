import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'

const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BNB', 'WBTC']
const SUPPORTED_ONRAMP_TOKENS_BSC = ['CAKE']

interface Params {
  currencySymbol?: string
  chainId?: ChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () =>
      !!currencySymbol &&
      !!chainId &&
      (SUPPORTED_ONRAMP_TOKENS.includes(currencySymbol) ||
        (SUPPORTED_ONRAMP_TOKENS_BSC.includes(currencySymbol) && chainId === ChainId.BSC)), // check CAKE with BSC only
    [currencySymbol, chainId],
  )
}
