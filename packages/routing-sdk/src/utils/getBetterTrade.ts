import { TradeType } from '@pancakeswap/swap-sdk-core'

import { Trade } from '../types'

export function getBetterTrade<T extends Trade<TradeType>>(tradeA?: T, tradeB?: T): T | undefined {
  if (!tradeA && !tradeB) return undefined
  if (!tradeA && tradeB) return tradeB
  if (tradeA && !tradeB) return tradeA

  const isExactIn = tradeA!.tradeType === TradeType.EXACT_INPUT
  if (isExactIn) {
    if (tradeB!.outputAmountWithGasAdjusted.greaterThan(tradeA!.outputAmountWithGasAdjusted)) {
      return tradeB
    }
    return tradeA
  }

  if (tradeB!.inputAmountWithGasAdjusted.lessThan(tradeA!.inputAmountWithGasAdjusted)) {
    return tradeB
  }
  return tradeA
}
