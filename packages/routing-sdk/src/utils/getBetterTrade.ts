import { TradeType } from '@pancakeswap/swap-sdk-core'

import { Trade } from '../types'

// Is trade A better than trade B
export function isTradeBetter<T extends Trade<TradeType>>(tradeA: T, tradeB: T): boolean {
  const isExactIn = tradeA.tradeType === TradeType.EXACT_INPUT
  if (isExactIn) {
    return tradeA.outputAmountWithGasAdjusted.greaterThan(tradeB.outputAmountWithGasAdjusted)
  }
  return tradeA.inputAmountWithGasAdjusted.lessThan(tradeB.inputAmountWithGasAdjusted)
}

export function getBetterTrade<T extends Trade<TradeType>>(tradeA?: T, tradeB?: T): T | undefined {
  if (!tradeA && !tradeB) return undefined
  if (!tradeA && tradeB) return tradeB
  if (tradeA && !tradeB) return tradeA

  if (isTradeBetter<T>(tradeB!, tradeA!)) {
    return tradeB
  }
  return tradeA
}
