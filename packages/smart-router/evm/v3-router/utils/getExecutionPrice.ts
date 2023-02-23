import { Price, TradeType } from '@pancakeswap/sdk'

import { Trade } from '../types'

export function getExecutionPrice({ inputAmount, outputAmount }: Trade<TradeType>) {
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
