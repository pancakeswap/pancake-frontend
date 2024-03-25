import { Currency, Price, TradeType, ZERO } from '@pancakeswap/sdk'

import { SmartRouterTrade } from '../types'

export function getExecutionPrice(
  trade: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount'> | undefined | null,
): Price<Currency, Currency> | undefined {
  if (!trade) {
    return undefined
  }

  const { inputAmount, outputAmount } = trade
  if (inputAmount.quotient === ZERO || outputAmount.quotient === ZERO) {
    return undefined
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
