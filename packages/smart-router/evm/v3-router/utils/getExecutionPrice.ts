import { Price, TradeType, ZERO } from '@pancakeswap/sdk'

import { SmartRouterTrade } from '../types'

export function getExecutionPrice({ inputAmount, outputAmount }: SmartRouterTrade<TradeType>) {
  if (inputAmount.quotient === ZERO || outputAmount.quotient === ZERO) {
    return null
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
