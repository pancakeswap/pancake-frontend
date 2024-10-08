import { Currency } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const shouldShowSwapWarning = (chainId: ChainId | undefined, swapCurrency?: Currency): boolean => {
  if (chainId && SwapWarningTokens[chainId] && swapCurrency) {
    const swapWarningTokens = Object.values(SwapWarningTokens[chainId])
    return swapWarningTokens.some((warningToken) => warningToken.equals(swapCurrency))
  }

  return false
}

export default shouldShowSwapWarning
