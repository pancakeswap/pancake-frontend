import { Price, TradeType, JSBI, ZERO } from '@pancakeswap/sdk'

import { SmartRouterTrade } from '../types'

export function getExecutionPrice({ inputAmount, outputAmount }: SmartRouterTrade<TradeType>) {
  if (JSBI.equal(inputAmount.quotient, ZERO) || JSBI.equal(outputAmount.quotient, ZERO)) {
    return null
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
