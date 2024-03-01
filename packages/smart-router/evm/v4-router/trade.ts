import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { formatFraction } from '@pancakeswap/utils/formatFractions'

import { findBestTrade } from './graph'
import { TradeConfig, V4Trade } from './types'
import { getPriceImpact } from '../v3-router/utils/getPriceImpact'

function getBestStreamsConfig(trade?: V4Trade<TradeType>) {
  const defaultStream = 10
  const maxStreams = 100
  if (!trade) {
    return defaultStream
  }
  const priceImpact = getPriceImpact(trade)
  if (!priceImpact) {
    return defaultStream
  }
  const { gasCostInBase, inputAmount, outputAmount } = trade
  if (!gasCostInBase) {
    return defaultStream
  }
  const amount = trade.tradeType === TradeType.EXACT_INPUT ? inputAmount : outputAmount

  const bestFlowAmount = Math.sqrt(
    (Number(gasCostInBase.toExact()) * Number(amount.toExact())) / Number(formatFraction(priceImpact.asFraction)),
  )
  const streams = Math.round(Number(amount.toExact()) / bestFlowAmount)
  if (!Number.isFinite(streams)) {
    return defaultStream
  }
  return Math.max(1, Math.min(streams, maxStreams))
}

function getBetterTrade(tradeA?: V4Trade<TradeType>, tradeB?: V4Trade<TradeType>): V4Trade<TradeType> | undefined {
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

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  quoteCurrency: Currency,
  tradeType: TradeType,
  { candidatePools, gasPriceWei, maxHops, maxSplits }: TradeConfig,
): Promise<V4Trade<TradeType> | undefined> {
  const bestTrade = await findBestTrade({
    tradeType,
    amount,
    quoteCurrency,
    gasPriceWei,
    candidatePools,
    maxHops,
    streams: 1,
  })
  // NOTE: there's no max split cap right now. This option is only used to contron the on/off of multiple splits
  if (maxSplits !== undefined && maxSplits === 0) {
    return bestTrade
  }
  const streams = getBestStreamsConfig(bestTrade)
  if (streams === 1) {
    return bestTrade
  }
  const bestTradeWithStreams = await findBestTrade({
    tradeType,
    amount,
    quoteCurrency,
    gasPriceWei,
    candidatePools,
    maxHops,
    streams,
  })

  return getBetterTrade(bestTrade, bestTradeWithStreams)
}
