import { Token } from '@pancakeswap/sdk'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const swapWarningTokens = Object.values(SwapWarningTokens)

const shouldShowSwapWarning = (swapCurrency: Token) => {
  return swapWarningTokens.some((warningToken) => swapCurrency.address === warningToken.address)
}

export default shouldShowSwapWarning
