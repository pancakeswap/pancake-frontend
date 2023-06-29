import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'

// TODO: refactor. We shouldn't import modules from views in higher level hooks
import { SUPPORTED_ONRAMP_TOKENS, isBuyCryptoSupported } from 'views/BuyCrypto/constants'

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
