import { Token } from '@pancakeswap/sdk'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const shouldShowSwapWarning = (chainId: number, swapCurrency: Token) => {
  const swapWarningTokens = Object.values(SwapWarningTokens[chainId])
  return swapWarningTokens.some((warningToken) => warningToken.equals(swapCurrency))
}

export default shouldShowSwapWarning
