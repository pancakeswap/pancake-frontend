import { useMemo } from 'react'

// TODO: refactor. We shouldn't import modules from views in higher level hooks
import { OnRampChainId, SUPPORTED_ONRAMP_TOKENS, isBuyCryptoSupported } from 'views/BuyCrypto/constants'

interface Params {
  currencySymbol?: string
  chainId?: OnRampChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () =>
      !!currencySymbol &&
      !!chainId &&
      isBuyCryptoSupported(chainId) &&
      SUPPORTED_ONRAMP_TOKENS.includes(currencySymbol),
    [currencySymbol, chainId],
  )
}
