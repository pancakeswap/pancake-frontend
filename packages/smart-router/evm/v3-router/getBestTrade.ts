/* eslint-disable no-console */
import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { computeAllRoutes, getBestRouteCombinationByQuotes } from './functions'
import { createGasModel } from './gasModel'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { BestRoutes, PoolProvider, QuoteProvider, Trade } from './types'

interface TradeConfig {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber: BigintIsh | (() => Promise<BigintIsh>)
  poolProvider: PoolProvider
  quoteProvider: QuoteProvider
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
}

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  config: TradeConfig,
): Promise<Trade<TradeType> | null> {
  try {
    const { blockNumber: blockNumberFromConfig } = config
    const blockNumber: BigintIsh =
      typeof blockNumberFromConfig === 'function' ? await blockNumberFromConfig() : blockNumberFromConfig
    const bestRoutes = await getBestRoutes(amount, currency, tradeType, {
      ...config,
      blockNumber,
    })
    if (!bestRoutes) {
      return null
    }

    const { routes, gasEstimateInUSD, gasEstimate, inputAmount, outputAmount } = bestRoutes
    // TODO restrict trade type to exact input if routes include one of the old
    // stable swap pools, which only allow to swap with exact input
    return {
      tradeType,
      routes,
      gasEstimate,
      gasEstimateInUSD,
      inputAmount,
      outputAmount,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

interface RouteConfig extends TradeConfig {
  blockNumber: BigintIsh
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent = 5,
    poolProvider,
    quoteProvider,
    blockNumber,
    gasPriceWei,
  }: RouteConfig,
): Promise<BestRoutes | null> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools(amount.currency, currency, blockNumber)
  if (!candidatePools.length) {
    return null
  }

  const baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops)
  const gasModel = await createGasModel({ gasPriceWei, poolProvider, quoteCurrency: currency, blockNumber })
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
    blockNumber,
    gasModel,
  })
  // routesWithValidQuote.forEach(({ percent, path, amount: a, quote }) => {
  //   const pathStr = path.map((t) => t.symbol).join('->')
  //   console.log(
  //     `${percent}% Swap`,
  //     a.toExact(),
  //     a.currency.symbol,
  //     'through',
  //     pathStr,
  //     ':',
  //     quote.toExact(),
  //     quote.currency.symbol,
  //   )
  // })
  return getBestRouteCombinationByQuotes(amount, routesWithValidQuote, tradeType, { maxSplits })
}
