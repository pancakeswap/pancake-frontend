import { BigintIsh, Currency, CurrencyAmount, TradeType, ZERO } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'

import { computeAllRoutes, getBestRouteCombinationByQuotes } from './functions'
import { createGasModel } from './gasModel'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { BestRoutes, TradeConfig, RouteConfig, SmartRouterTrade, RouteType } from './types'
import { ROUTE_CONFIG_BY_CHAIN } from './constants'

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  config: TradeConfig,
): Promise<SmartRouterTrade<TradeType> | null> {
  const { blockNumber: blockNumberFromConfig } = config
  const blockNumber: BigintIsh | undefined =
    typeof blockNumberFromConfig === 'function' ? await blockNumberFromConfig() : blockNumberFromConfig
  const bestRoutes = await getBestRoutes(amount, currency, tradeType, {
    ...config,
    blockNumber,
  })
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(ZERO)) {
    throw new Error('Cannot find a valid swap route')
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
    blockNumber,
  }
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  routeConfig: RouteConfig,
): Promise<BestRoutes | null> {
  const { chainId } = currency
  const {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent = 5,
    poolProvider,
    quoteProvider,
    blockNumber,
    gasPriceWei,
    allowedPoolTypes,
    quoterOptimization,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
    signal,
  } = {
    ...routeConfig,
    ...(ROUTE_CONFIG_BY_CHAIN[chainId as ChainId] || {}),
  }
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools({
    currencyA: amount.currency,
    currencyB: currency,
    blockNumber,
    protocols: allowedPoolTypes,
    signal,
  })

  let baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops)
  // Do not support mix route on exact output
  if (tradeType === TradeType.EXACT_OUTPUT) {
    baseRoutes = baseRoutes.filter(({ type }) => type !== RouteType.MIXED)
  }

  const gasModel = await createGasModel({
    gasPriceWei,
    poolProvider,
    quoteCurrency: currency,
    blockNumber,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
  })
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
    blockNumber,
    gasModel,
    quoterOptimization,
    signal,
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
  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits })
}
