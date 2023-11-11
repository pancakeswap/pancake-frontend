import { Token } from '@pancakeswap/sdk'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const shouldShowSwapWarning = (swapCurrency: Token, chainId?: number): boolean => {
  if (chainId && SwapWarningTokens[chainId]) {
    const swapWarningTokens = Object.values(SwapWarningTokens[chainId])
    return swapWarningTokens.some((warningToken) => warningToken.equals(swapCurrency))
  }

  return false
}

export default shouldShowSwapWarning
