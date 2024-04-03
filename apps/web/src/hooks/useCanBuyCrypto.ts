import type { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'

const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB', 'WBTC']

interface Params {
  currencySymbol?: string
  chainId?: ChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () => !!currencySymbol && !!chainId && SUPPORTED_ONRAMP_TOKENS.includes(currencySymbol),
    [currencySymbol, chainId],
  )
}
