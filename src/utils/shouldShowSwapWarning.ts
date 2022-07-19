import { Token } from '@pancakeswap/sdk'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const swapWarningTokens = Object.values(SwapWarningTokens)

const shouldShowSwapWarning = (swapCurrency: Token) => {
  return swapWarningTokens.some((warningToken) => swapCurrency.equals(warningToken))
}

export default shouldShowSwapWarning
