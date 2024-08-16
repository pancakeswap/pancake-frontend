import { TradeType } from '@pancakeswap/swap-sdk-core'
import { formatFraction } from '@pancakeswap/utils/formatFractions'

import { Trade } from './types'
import { getPriceImpact } from './utils'

export const DEFAULT_STREAM = 10

export function getBestStreamsConfig(trade?: Trade<TradeType>) {
  const maxStreams = 100
  if (!trade) {
    return DEFAULT_STREAM
  }
  const priceImpact = getPriceImpact(trade)
  if (!priceImpact) {
    return DEFAULT_STREAM
  }
  const { gasUseEstimateBase, inputAmount, outputAmount } = trade
  if (!gasUseEstimateBase) {
    return DEFAULT_STREAM
  }
  const amount = trade.tradeType === TradeType.EXACT_INPUT ? inputAmount : outputAmount

  const bestFlowAmount = Math.sqrt(
    (Number(gasUseEstimateBase.toExact()) * Number(amount.toExact())) / Number(formatFraction(priceImpact.asFraction)),
  )
  const streams = Math.round(Number(amount.toExact()) / bestFlowAmount)
  if (!Number.isFinite(streams)) {
    return DEFAULT_STREAM
  }
  return Math.max(1, Math.min(streams, maxStreams))
}
