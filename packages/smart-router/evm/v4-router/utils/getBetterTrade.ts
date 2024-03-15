import { TradeType } from '@pancakeswap/sdk'

import { V4Trade } from '../types'

export function getBetterTrade(
  tradeA?: V4Trade<TradeType>,
  tradeB?: V4Trade<TradeType>,
): V4Trade<TradeType> | undefined {
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
