import { formatFraction } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount, Fraction, TradeType } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'

import { PriceCalculator, createGraph, createPriceCalculator, getNeighbour } from './graph'
import { Edge, Graph, Pool, Route, TradeConfig, TradeWithGraph, Vertice } from './types'
import { isSameRoute, mergeRoute } from './route'
import { groupPoolsByType } from './utils/groupPoolsByType'
import { getBetterTrade } from './utils/getBetterTrade'
import { DEFAULT_STREAM, getBestStreamsConfig } from './stream'

export type FindBestTradeByStreamsParams = TradeConfig & {
  amount: CurrencyAmount<Currency>
  quoteCurrency: Currency

  tradeType: TradeType

  // If number is provided then will treat as number of streams, e.g. 3
  // If array is provided then will treat as stream distribution, e.g. [1, 1, 1]
  streams: number[] | number

  // If graph is provided, will use it directly without creating new graph from candidatePools
  graph?: Graph
}

export type FindBestTradeParams = Omit<FindBestTradeByStreamsParams, 'streams'>

export async function findBestTrade({
  maxSplits,
  ...params
}: FindBestTradeParams): Promise<TradeWithGraph<TradeType> | undefined> {
  // NOTE: there's no max split cap right now. This option is only used to control the on/off of multiple splits
  const splitDisabled = maxSplits !== undefined && maxSplits === 0

  let bestTrade: TradeWithGraph<TradeType> | undefined
  try {
    bestTrade = await findBestTradeByStreams({
      ...params,
      streams: 1,
    })
  } catch (e) {
    if (splitDisabled) {
      throw e
    }
    bestTrade = await findBestTradeByStreams({
      ...params,
      streams: DEFAULT_STREAM,
    })
  }

  if (splitDisabled) {
    return bestTrade
  }
  const streams = getBestStreamsConfig(bestTrade)
  if (streams === 1) {
    return bestTrade
  }
  const bestTradeWithStreams = await findBestTradeByStreams({
    ...params,
    streams,
  })

  return getBetterTrade(bestTrade, bestTradeWithStreams)
}

export async function findBestTradeByStreams(
  params: FindBestTradeByStreamsParams,
): Promise<TradeWithGraph<TradeType> | undefined> {
  const { tradeType, candidatePools, ...rest } = params
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  if (isExactIn) {
    return getBestTrade(params)
  }

  // Exact output doesn't support mixed route
  const poolsByType = groupPoolsByType(candidatePools)
  const trades = await Promise.allSettled(
    poolsByType.map((pools) => getBestTrade({ tradeType, candidatePools: pools, ...rest })),
  )
  let bestTrade: TradeWithGraph<TradeType> | undefined
  for (const result of trades) {
    if (result.status === 'rejected' || !result.value) {
      continue
    }
    const { value: trade } = result
    if (!bestTrade) {
      bestTrade = trade
      continue
    }
    bestTrade = getBetterTrade(bestTrade, trade)
  }
  return bestTrade
}

async function getBestTrade({
  amount: totalAmount,
  candidatePools,
  quoteCurrency,
  gasPriceWei,
  streams,
  graph: graphOverride,
  tradeType,
  maxHops = 10,
}: FindBestTradeByStreamsParams): Promise<TradeWithGraph<TradeType> | undefined> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const baseCurrency = totalAmount.currency
  const inputCurrency = isExactIn ? baseCurrency : quoteCurrency
  const outputCurrency = isExactIn ? quoteCurrency : baseCurrency
  const graph = graphOverride || createGraph({ pools: candidatePools })
  const amounts = getStreamedAmounts(totalAmount, streams)

  const gasPrice = BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)

  // 1. Set static prices for each vertices
  const start = graph.getVertice(baseCurrency)
  const finish = graph.getVertice(quoteCurrency)
  if (!start || !finish) {
    throw new Error(`Invalid start vertice or finish vertice. Start ${start}, finish ${finish}`)
  }
  const priceCalculator = createPriceCalculator({
    quote: start,
    gasPriceWei: gasPrice,
    graph,
  })
  const adjustQuoteByGas = (quote: CurrencyAmount<Currency>, gasCostInQuote: CurrencyAmount<Currency>) =>
    isExactIn ? quote.subtract(gasCostInQuote) : quote.add(gasCostInQuote)
  const isQuoteBetter = (quote: CurrencyAmount<Currency>, compareTo: CurrencyAmount<Currency>) =>
    isExactIn ? quote.greaterThan(compareTo) : quote.lessThan(compareTo)
  const getInputAmount = (amount: CurrencyAmount<Currency>, quote: CurrencyAmount<Currency>) =>
    isExactIn ? amount : quote
  const getOutputAmount = (amount: CurrencyAmount<Currency>, quote: CurrencyAmount<Currency>) =>
    isExactIn ? quote : amount
  const getQuoteAmount = (r: Route) => (isExactIn ? r.outputAmount : r.inputAmount)

  const buildTrade = (g: Graph, routes: Route[]): TradeWithGraph<TradeType> => {
    const {
      gasEstimate,
      quoteAmount,
      gasCostInQuote,
      gasCostInBase,
      inputAmountWithGasAdjusted,
      outputAmountWithGasAdjusted,
    } = routes.reduce<{
      gasEstimate: bigint
      quoteAmount: CurrencyAmount<Currency>
      gasCostInBase: CurrencyAmount<Currency>
      gasCostInQuote: CurrencyAmount<Currency>
      inputAmountWithGasAdjusted: CurrencyAmount<Currency>
      outputAmountWithGasAdjusted: CurrencyAmount<Currency>
    }>(
      (result, r) => {
        return {
          gasEstimate: result.gasEstimate + r.gasUseEstimate,
          quoteAmount: result.quoteAmount.add(getQuoteAmount(r)),
          gasCostInBase: result.gasCostInBase.add(r.gasUseEstimateBase),
          gasCostInQuote: result.gasCostInQuote.add(r.gasUseEstimateQuote),
          inputAmountWithGasAdjusted: result.inputAmountWithGasAdjusted.add(r.inputAmountWithGasAdjusted),
          outputAmountWithGasAdjusted: result.outputAmountWithGasAdjusted.add(r.outputAmountWithGasAdjusted),
        }
      },
      {
        gasEstimate: 0n,
        quoteAmount: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
        gasCostInBase: CurrencyAmount.fromRawAmount(baseCurrency, 0),
        gasCostInQuote: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
        inputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(inputCurrency, 0),
        outputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(outputCurrency, 0),
      },
    )

    return {
      gasUseEstimateBase: gasCostInBase,
      gasUseEstimateQuote: gasCostInQuote,
      inputAmountWithGasAdjusted,
      outputAmountWithGasAdjusted,
      gasUseEstimate: gasEstimate,
      inputAmount: getInputAmount(totalAmount, quoteAmount),
      outputAmount: getOutputAmount(totalAmount, quoteAmount),
      tradeType,
      graph: g,
      routes,
    }
  }

  // 2. Find best route using Dijkstra's algo
  async function findBestRoute(amount: CurrencyAmount<Currency>): Promise<Omit<Route, 'percent'> | undefined> {
    invariant(start !== undefined && finish !== undefined, 'Invalid start/finish vertice')
    const bestResult = new Map<
      Vertice,
      {
        hops: number
        gasSpent?: bigint
        bestAmount: CurrencyAmount<Currency>
        bestQuote?: CurrencyAmount<Currency>
        bestSource?: Edge
      }
    >()
    const processedVert = new Set<Vertice>()
    bestResult.set(start, {
      hops: 0,
      bestAmount: amount,
      gasSpent: 0n,
    })
    const nextVertList: Vertice[] = [start]
    const getHops = (vert: Vertice) => bestResult.get(vert)?.hops || 0
    const getBestAmount = (vert: Vertice) => bestResult.get(vert)?.bestAmount
    const getBestQuote = (vert: Vertice) => bestResult.get(vert)?.bestQuote
    const getBestSource = (vert: Vertice) => bestResult.get(vert)?.bestSource
    const getGasSpent = (vert: Vertice) => bestResult.get(vert)?.gasSpent || 0n
    const getNextVert = () => {
      let vert: Vertice | undefined
      let bestQuote: CurrencyAmount<Currency> | undefined
      let bestVertIndex: number | undefined
      for (const [i, vertice] of nextVertList.entries()) {
        const currentBestQuote = getBestQuote(vertice)
        if (
          vert === undefined ||
          bestQuote === undefined ||
          (currentBestQuote && isQuoteBetter(currentBestQuote, bestQuote))
        ) {
          vert = vertice
          bestQuote = currentBestQuote
          bestVertIndex = i
        }
      }
      return { vert, index: bestVertIndex }
    }
    const getBestRoute = (vert: Vertice) => {
      const pools: Pool[] = []
      const path: Currency[] = [vert.currency]
      for (let v: Vertice | undefined = finish; getBestSource(v); v = getNeighbour(getBestSource(v)!, v)) {
        const bestSource = getBestSource(v)
        invariant(bestSource !== undefined, 'Invalid best source')
        const neighbour = getNeighbour(bestSource, v)
        if (isExactIn) {
          pools.unshift(bestSource.pool)
          path.unshift(neighbour?.currency)
        } else {
          pools.push(bestSource.pool)
          path.push(neighbour?.currency)
        }
      }

      // DEBUG
      // console.log(
      //   '[DEBUG ROUTE]: ',
      //   path
      //     .map((t) => {
      //       const v = graph.getVertice(t)
      //       const amount = v && getBestAmount(v)
      //       return `${amount?.toExact()} ${amount?.currency.symbol}`
      //     })
      //     .join(' -> '),
      // )

      const gasCost = getGasSpent(vert)
      const quoteAmountRaw = getBestAmount(vert)
      invariant(quoteAmountRaw !== undefined, 'Invalid quote amount')
      const quoteAmount = CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmountRaw.quotient)
      const gasCostInBase = getGasCostInCurrency({
        priceCalculator,
        gasCost,
        currency: baseCurrency,
      })
      const gasCostInQuote = getGasCostInCurrency({
        priceCalculator,
        gasCost,
        currency: quoteCurrency,
      })
      const quoteAmountWithGasAdjusted = CurrencyAmount.fromRawAmount(
        quoteCurrency,
        gasCostInQuote ? adjustQuoteByGas(quoteAmount, gasCostInQuote).quotient : 0,
      )

      return {
        path,
        pools,
        gasUseEstimate: gasCost,
        inputAmount: getInputAmount(amount, quoteAmount),
        outputAmount: getOutputAmount(amount, quoteAmount),
        inputAmountWithGasAdjusted: getInputAmount(amount, quoteAmountWithGasAdjusted),
        outputAmountWithGasAdjusted: getOutputAmount(amount, quoteAmountWithGasAdjusted),
        gasUseEstimateQuote: gasCostInQuote,
        gasUseEstimateBase: gasCostInBase,
      }
    }

    for (;;) {
      const { vert, index } = getNextVert()
      if (!vert || index === undefined) return undefined

      // console.log('Next vert ->', vert.currency.symbol);

      if (vert === finish) {
        return getBestRoute(vert)
      }
      nextVertList.splice(index, 1)

      const currentHop = getHops(vert)
      for (const e of vert.edges) {
        const prevBestSource = getBestSource(vert)

        // Exact output doesn't support mixed route
        if (!isExactIn && prevBestSource && e.pool.type !== prevBestSource.pool.type) {
          continue
        }

        const v2 = vert === e.vertice0 ? e.vertice1 : e.vertice0
        if (processedVert.has(v2)) continue

        if (!graph.hasValidRouteToVerticeWithinHops(v2, finish, maxHops - currentHop - 1)) {
          continue
        }

        try {
          const bestAmount = getBestAmount(vert)
          invariant(bestAmount !== undefined, 'Invalid amount')
          // eslint-disable-next-line no-await-in-loop
          const quoteResult = e.pool.getQuote({
            amount: bestAmount,
            isExactIn,
            quoteCurrency: e.vertice0.currency.wrapped.equals(bestAmount.currency.wrapped)
              ? e.vertice1.currency
              : e.vertice0.currency,
          })
          // console.log(`Get quote success ${quoteResult?.quote.toExact()}`)
          invariant(quoteResult !== undefined, 'Invalid quote result')
          const { quote } = quoteResult
          const gasPriceInV2 = priceCalculator.getGasPriceInBase(v2)
          invariant(gasPriceInV2 !== undefined, 'Invalid gas price in v2')
          const gasSpent = e.pool.estimateGasCostForQuote(quoteResult) + getGasSpent(vert)

          const price = priceCalculator.getPrice(v2, finish)
          invariant(
            price !== undefined,
            `Failed to get price, base ${v2.currency.symbol}, quote ${finish.currency.symbol}`,
          )
          const gasSpentInQuote = price.quote(gasPriceInV2.multiply(gasSpent))
          const newQuote = adjustQuoteByGas(price.quote(quote), gasSpentInQuote)
          // const newQuote = price.quote(quote);
          const bestSource = getBestSource(v2)
          const v2BestQuote = getBestQuote(v2)

          // console.log(
          //   v2.currency.symbol,
          //   e.pool.log(),
          //   newQuote.toExact(),
          //   newQuote.currency.symbol,
          // );
          if (!bestSource) nextVertList.push(v2)
          if (!bestSource || !v2BestQuote || isQuoteBetter(newQuote, v2BestQuote)) {
            bestResult.set(v2, {
              hops: currentHop + 1,
              gasSpent,
              bestAmount: quote,
              bestSource: e,
              bestQuote: newQuote,
            })
          }
        } catch (_err) {
          // console.error(
          //   `[GetQuote]: Failed to get quote from ${vert.currency.symbol} to ${v2.currency.symbol}`,
          //   e.pool,
          //   _err,
          // )
          // console.error(_err)
          continue
        }
      }
      processedVert.add(vert)
    }
  }

  let routeMerged = false
  const routes: Route[] = []
  for (const { amount, percent } of amounts) {
    // eslint-disable-next-line no-await-in-loop
    const route = await findBestRoute(amount)
    invariant(
      route !== undefined,
      `No valid route found for base amount ${amount.toExact()} ${amount.currency.symbol} and quote currency ${
        quoteCurrency.symbol
      }`,
    )
    // eslint-disable-next-line no-await-in-loop
    await graph.applySwap({ route, isExactIn })
    const newRoute = {
      ...route,
      percent,
    }
    const index = routes.findIndex((r) => isSameRoute(r, newRoute))
    if (index < 0) {
      routes.push(newRoute)
    } else {
      routes[index] = mergeRoute(routes[index], newRoute)
      routeMerged = true
    }
  }
  // No valid route found
  if (!routes.length) {
    return undefined
  }

  if (!routeMerged) {
    return buildTrade(graph, routes)
  }

  // Rebuild graph if route is merged and estimate actual quote and gas cost
  const finalGraph = createGraph({
    graph: graphOverride,
    pools: candidatePools,
  })
  const s = finalGraph.getVertice(baseCurrency)
  invariant(s !== undefined, '[Graph rebuild]: Invalid start vertice')
  const pc = createPriceCalculator({
    quote: s,
    gasPriceWei: gasPrice,
    graph: finalGraph,
  })
  const finalRoutes: Route[] = []
  for (const r of routes) {
    // eslint-disable-next-line no-await-in-loop
    const { amount, quote: quoteRaw, gasUseEstimate } = await finalGraph.applySwap({ isExactIn, route: r })
    const quote = CurrencyAmount.fromRawAmount(quoteCurrency, quoteRaw.quotient)
    const gasCostInBase = getGasCostInCurrency({
      priceCalculator: pc,
      gasCost: gasUseEstimate,
      currency: baseCurrency,
    })
    const gasCostInQuote = getGasCostInCurrency({
      priceCalculator: pc,
      gasCost: gasUseEstimate,
      currency: quoteCurrency,
    })
    const quoteAmountWithGasAdjusted = CurrencyAmount.fromRawAmount(
      quoteCurrency,
      gasCostInQuote ? adjustQuoteByGas(quote, gasCostInQuote).quotient : 0,
    )
    finalRoutes.push({
      ...r,
      gasUseEstimate,
      inputAmount: getInputAmount(amount, quote),
      outputAmount: getOutputAmount(amount, quote),
      inputAmountWithGasAdjusted: getInputAmount(amount, quoteAmountWithGasAdjusted),
      outputAmountWithGasAdjusted: getOutputAmount(amount, quoteAmountWithGasAdjusted),
      gasUseEstimateQuote: gasCostInQuote,
      gasUseEstimateBase: gasCostInBase,
    })
  }
  return buildTrade(finalGraph, finalRoutes)
}

function getStreamedAmounts(
  amount: CurrencyAmount<Currency>,
  streams: number[] | number,
): { amount: CurrencyAmount<Currency>; percent: number }[] {
  const streamSum = Array.isArray(streams) ? streams.reduce((sum, s) => sum + s, 0) : streams
  const streamDistributions = Array.isArray(streams)
    ? streams.map((stream) => new Fraction(stream, streamSum))
    : Array.from({ length: streams }).map(() => new Fraction(1, streamSum))
  const numOfStreams = streamDistributions.length

  let sum = new Fraction(0)
  const amounts: { amount: CurrencyAmount<Currency>; percent: number }[] = []
  for (const [index, stream] of streamDistributions.entries()) {
    const streamAmount = index === numOfStreams - 1 ? amount.subtract(amount.multiply(sum)) : amount.multiply(stream)
    const revisedStream = index === numOfStreams - 1 ? new Fraction(1).subtract(sum) : stream
    const percent = Number(formatFraction(revisedStream) || 0) * 100
    amounts.push({ amount: streamAmount, percent })
    sum = sum.add(stream)
  }
  return amounts
}

function getGasCostInCurrency({
  priceCalculator,
  gasCost,
  currency,
}: {
  priceCalculator: PriceCalculator
  gasCost: bigint
  currency: Currency
}) {
  const v = priceCalculator.graph.getVertice(currency)
  const gasPriceInCurrency = v && priceCalculator.getGasPriceInBase(v)
  const gasCostInCurrencyRaw = gasPriceInCurrency?.multiply(gasCost)
  return CurrencyAmount.fromRawAmount(currency, gasCostInCurrencyRaw?.quotient || 0)
}
