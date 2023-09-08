import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { SUPPORTED_ONRAMP_TOKENS, isBuyCryptoSupported } from 'config/constants/buyCrypto'

interface Params {
  currencySymbol?: string
  chainId?: ChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () =>
      Boolean(currencySymbol && chainId) &&
      isBuyCryptoSupported(chainId) &&
      SUPPORTED_ONRAMP_TOKENS.includes(currencySymbol),
    [currencySymbol, chainId],
  )
}
