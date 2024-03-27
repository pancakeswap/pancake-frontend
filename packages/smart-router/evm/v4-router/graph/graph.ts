import { Currency, CurrencyAmount, TradeType, Fraction } from '@pancakeswap/sdk'
import { Address } from 'viem'
import invariant from 'tiny-invariant'
import { formatFraction } from '@pancakeswap/utils/formatFractions'
import memoize from 'lodash/memoize.js'

import { Pool } from '../../v3-router/types'
import { createPoolQuoteGetter } from '../../v3-router/providers'
import { buildBaseRoute, getPoolAddress, isStablePool } from '../../v3-router/utils'
import { V4Trade, Edge, Vertice, Graph, TradeConfig, V4Route } from '../types'
import { getCurrencyPairs } from '../pool'
import { getNeighbour } from './edge'
import { PriceCalculator, createPriceCalculator } from './priceCalculator'
import { estimateGasCost } from '../gasCost'
import { isSameRoute, mergeRoute } from './route'
import { getBetterTrade, groupPoolsByType } from '../utils'

type GraphParams = {
  pools?: Pool[]

  // If graph is provided, will clone it without creating new graph from pools
  graph?: Graph
}

function getEdgeKey(p: Pool, vertA: Vertice, vertB: Vertice): string {
  const [vert0, vert1] = vertA.currency.wrapped.sortsBefore(vertB.currency.wrapped) ? [vertA, vertB] : [vertB, vertA]
  return `${vert0.currency.chainId}-${vert0.currency.wrapped.address}-${
    vert1.currency.wrapped.address
  }-${getPoolAddress(p)}`
}

function cloneGraph(graph: Graph): Graph {
  const pools = graph.edges.map((e) => e.pool)
  return createGraph({ pools })
}

export function createGraph({ pools, graph }: GraphParams): Graph {
  if (graph) {
    return cloneGraph(graph)
  }

  if (!pools) {
    throw new Error('[Create graph]: Invalid pools')
  }

  const verticeMap = new Map<Address, Vertice>()
  const edgeMap = new Map<string, Edge>()

  for (const p of pools) {
    const pairs = getCurrencyPairs(p)
    for (const [currency0, currency1] of pairs) {
      const vertice0 = createVertice(currency0)
      const vertice1 = createVertice(currency1)
      const edge = createEdge(p, vertice0, vertice1)
      if (!vertice0.edges.includes(edge)) vertice0.edges.push(edge)
      if (!vertice1.edges.includes(edge)) vertice1.edges.push(edge)
    }
  }

  function getVertice(c: Currency): Vertice | undefined {
    return verticeMap.get(c.wrapped.address)
  }

  function getEdge(p: Pool, vert0: Vertice, vert1: Vertice): Edge | undefined {
    return edgeMap.get(getEdgeKey(p, vert0, vert1))
  }

  function createVertice(c: Currency): Vertice {
    const vert = getVertice(c)
    if (vert) {
      return vert
    }
    const vertice: Vertice = { currency: c, edges: [] }
    verticeMap.set(c.wrapped.address, vertice)
    return vertice
  }

  function createEdge(p: Pool, vertice0: Vertice, vertice1: Vertice): Edge {
    const edgeKey = getEdgeKey(p, vertice0, vertice1)
    if (!edgeKey) {
      throw new Error(`Create edge failed. Cannot get valid edge key for ${p}`)
    }
    const e = edgeMap.get(edgeKey)
    if (e) {
      return e
    }
    const edge: Edge = {
      vertice0,
      vertice1,
      pool: p,
    }
    edgeMap.set(edgeKey, edge)
    return edge
  }

  const hasValidRouteToVerticeWithinHops = memoize(
    (vertice: Vertice, target: Vertice, hops: number, visitedVertices?: Set<Vertice>): boolean => {
      if (vertice === target) {
        return true
      }
      if (hops <= 0) {
        return false
      }
      const visited = visitedVertices || new Set<Vertice>()
      visited.add(vertice)
      for (const edge of vertice.edges) {
        const nextVertice = getNeighbour(edge, vertice)
        if (nextVertice && !visited.has(nextVertice)) {
          if (hasValidRouteToVerticeWithinHops(nextVertice, target, hops - 1, visited)) {
            return true
          }
        }
      }
      return false
    },
    (v1, v2, hops) => `${v1.currency.chainId}-${v1.currency.wrapped.address}-${v2.currency.wrapped.address}-${hops}`,
  )

  return {
    vertices: Array.from(verticeMap.values()),
    edges: Array.from(edgeMap.values()),
    getVertice,
    getEdge,
    hasValidRouteToVerticeWithinHops,
    applySwap: async ({ isExactIn, route }) => {
      const getPoolQuote = createPoolQuoteGetter(isExactIn)
      function* loopPools() {
        let i = isExactIn ? 0 : route.pools.length - 1
        const getNext = () => (isExactIn ? i + 1 : i - 1)
        const hasNext = isExactIn ? () => i < route.pools.length : () => i >= 0
        for (; hasNext(); i = getNext()) {
          yield i
        }
      }

      const amount = isExactIn ? route.inputAmount : route.outputAmount
      invariant(amount !== undefined, '[Apply swap]: Invalid base amount')
      let quote = amount
      let gasCost = 0n
      for (const i of loopPools()) {
        const vertA = getVertice(route.path[i])
        const vertB = getVertice(route.path[i + 1])
        const p = route.pools[i]
        invariant(
          vertA !== undefined && vertB !== undefined && p !== undefined,
          '[Apply swap]: Invalid vertice and pool',
        )
        const edge = getEdge(p, vertA, vertB)
        invariant(edge !== undefined, '[Apply swap]: No valid edge found')
        // eslint-disable-next-line no-await-in-loop
        const quoteResult = await getPoolQuote(edge.pool, quote)
        invariant(quoteResult !== undefined, '[Apply swap]: Failed to get quote')
        edge.pool = quoteResult.poolAfter
        quote = quoteResult.quote
        gasCost += estimateGasCost(quoteResult)
      }
      return {
        amount,
        quote,
        gasCost,
      }
    },
  }
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

type FindBestTradeParams = TradeConfig & {
  amount: CurrencyAmount<Currency>
  quoteCurrency: Currency

  tradeType: TradeType

  // If number is provided then will treat as number of streams, e.g. 3
  // If array is provided then will treat as stream distribution, e.g. [1, 1, 1]
  streams: number[] | number

  // If graph is provided, will use it directly without creating new graph from candidatePools
  graph?: Graph
}

const getGasCostInCurrency = ({
  priceCalculator,
  gasCost,
  currency,
}: {
  priceCalculator: PriceCalculator
  gasCost: bigint
  currency: Currency
}) => {
  const v = priceCalculator.graph.getVertice(currency)
  const gasPriceInCurrency = v && priceCalculator.getGasPriceInBase(v)
  const gasCostInCurrencyRaw = gasPriceInCurrency?.multiply(gasCost)
  return CurrencyAmount.fromRawAmount(currency, gasCostInCurrencyRaw?.quotient || 0)
}

export async function findBestTrade(params: FindBestTradeParams): Promise<V4Trade<TradeType> | undefined> {
  const { tradeType, candidatePools, ...rest } = params
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  if (isExactIn) {
    return getBestTrade(params)
  }

  // Exact output doesn't support mixed route
  // Disable stable swap for exact output as it's not natively supported. TX may fail if multiple swaps are executed within the same block
  const poolsByType = groupPoolsByType(candidatePools).filter((pools) => !isStablePool(pools[0]))
  const trades = await Promise.allSettled(
    poolsByType.map((pools) => getBestTrade({ tradeType, candidatePools: pools, ...rest })),
  )
  let bestTrade: V4Trade<TradeType> | undefined
  for (const result of trades) {
    if (result.status === 'rejected') {
      continue
    }
    const { value: trade } = result
    if (!trade) {
      continue
    }
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
  maxHops = 3,
}: FindBestTradeParams): Promise<V4Trade<TradeType> | undefined> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const baseCurrency = totalAmount.currency
  const inputCurrency = isExactIn ? baseCurrency : quoteCurrency
  const outputCurrency = isExactIn ? quoteCurrency : baseCurrency
  const graph = graphOverride || createGraph({ pools: candidatePools })
  const amounts = getStreamedAmounts(totalAmount, streams)

  const getPoolQuote = createPoolQuoteGetter(isExactIn)
  const gasPrice = BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)

  // 1. Set static prices for each vertices
  const start = graph.getVertice(baseCurrency)
  const finish = graph.getVertice(quoteCurrency)
  if (!start || !finish) {
    throw new Error(`Invalid start vertice or finish vertice. Start ${start}, finish ${finish}`)
  }
  const priceCalculator = createPriceCalculator({ quote: start, gasPriceWei: gasPrice, graph })
  const adjustQuoteByGas = (quote: CurrencyAmount<Currency>, gasCostInQuote: CurrencyAmount<Currency>) =>
    isExactIn ? quote.subtract(gasCostInQuote) : quote.add(gasCostInQuote)
  const isQuoteBetter = (quote: CurrencyAmount<Currency>, compareTo: CurrencyAmount<Currency>) =>
    isExactIn ? quote.greaterThan(compareTo) : quote.lessThan(compareTo)
  const getInputAmount = (amount: CurrencyAmount<Currency>, quote: CurrencyAmount<Currency>) =>
    isExactIn ? amount : quote
  const getOutputAmount = (amount: CurrencyAmount<Currency>, quote: CurrencyAmount<Currency>) =>
    isExactIn ? quote : amount
  const getQuoteAmount = (r: V4Route) => (isExactIn ? r.outputAmount : r.inputAmount)

  const buildTrade = (g: Graph, routes: V4Route[]): V4Trade<TradeType> => {
    const {
      gasUseEstimate,
      quoteAmount,
      gasUseEstimateQuote,
      gasUseEstimateBase,
      inputAmountWithGasAdjusted,
      outputAmountWithGasAdjusted,
    } = routes.reduce<{
      gasUseEstimate: bigint
      quoteAmount: CurrencyAmount<Currency>
      gasUseEstimateBase: CurrencyAmount<Currency>
      gasUseEstimateQuote: CurrencyAmount<Currency>
      inputAmountWithGasAdjusted: CurrencyAmount<Currency>
      outputAmountWithGasAdjusted: CurrencyAmount<Currency>
    }>(
      (result, r) => {
        return {
          gasUseEstimate: result.gasUseEstimate + r.gasUseEstimate,
          quoteAmount: result.quoteAmount.add(getQuoteAmount(r)),
          gasUseEstimateBase: result.gasUseEstimateBase.add(r.gasUseEstimateBase),
          gasUseEstimateQuote: result.gasUseEstimateQuote.add(r.gasUseEstimateQuote),
          inputAmountWithGasAdjusted: result.inputAmountWithGasAdjusted.add(r.inputAmountWithGasAdjusted),
          outputAmountWithGasAdjusted: result.outputAmountWithGasAdjusted.add(r.outputAmountWithGasAdjusted),
        }
      },
      {
        gasUseEstimate: 0n,
        quoteAmount: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
        gasUseEstimateBase: CurrencyAmount.fromRawAmount(baseCurrency, 0),
        gasUseEstimateQuote: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
        inputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(inputCurrency, 0),
        outputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(outputCurrency, 0),
      },
    )

    return {
      gasUseEstimate,
      gasUseEstimateQuote,
      gasUseEstimateBase,
      inputAmountWithGasAdjusted,
      outputAmountWithGasAdjusted,
      inputAmount: getInputAmount(totalAmount, quoteAmount),
      outputAmount: getOutputAmount(totalAmount, quoteAmount),
      tradeType,
      graph: g,
      routes,
    }
  }

  // 2. Find best route using Dijkstra's algo
  async function findBestRoute(amount: CurrencyAmount<Currency>): Promise<Omit<V4Route, 'percent'> | undefined> {
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
      const gasCost = getGasSpent(vert)
      const quoteAmountRaw = getBestAmount(vert)
      invariant(quoteAmountRaw !== undefined, 'Invalid quote amount')
      const quoteAmount = CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmountRaw.quotient)
      const gasUseEstimateBase = getGasCostInCurrency({ priceCalculator, gasCost, currency: baseCurrency })
      const gasUseEstimateQuote = getGasCostInCurrency({ priceCalculator, gasCost, currency: quoteCurrency })
      const quoteAmountWithGasAdjusted = CurrencyAmount.fromRawAmount(
        quoteCurrency,
        gasUseEstimateQuote ? adjustQuoteByGas(quoteAmount, gasUseEstimateQuote).quotient : 0,
      )

      const { type } = buildBaseRoute(pools, start.currency, finish.currency)
      return {
        type,
        path,
        pools,
        gasUseEstimate: gasCost,
        inputAmount: getInputAmount(amount, quoteAmount),
        outputAmount: getOutputAmount(amount, quoteAmount),
        inputAmountWithGasAdjusted: getInputAmount(amount, quoteAmountWithGasAdjusted),
        outputAmountWithGasAdjusted: getOutputAmount(amount, quoteAmountWithGasAdjusted),
        gasUseEstimateQuote,
        gasUseEstimateBase,
      }
    }

    for (;;) {
      const { vert, index } = getNextVert()
      if (!vert || index === undefined) return undefined

      if (vert === finish) {
        return getBestRoute(vert)
      }
      nextVertList.splice(index, 1)

      const currentHop = getHops(vert)
      for (const e of vert.edges) {
        const v2 = vert === e.vertice0 ? e.vertice1 : e.vertice0
        if (processedVert.has(v2)) continue

        if (!graph.hasValidRouteToVerticeWithinHops(v2, finish, maxHops - currentHop - 1)) {
          continue
        }

        try {
          const bestAmount = getBestAmount(vert)
          invariant(bestAmount !== undefined, 'Invalid amount')
          // eslint-disable-next-line no-await-in-loop
          const quoteResult = await getPoolQuote(e.pool, bestAmount)
          // console.log(`Get quote success ${quoteResult?.quote.toExact()}`)
          invariant(quoteResult !== undefined, 'Invalid quote result')
          const { quote } = quoteResult
          const gasPriceInV2 = priceCalculator.getGasPriceInBase(v2)
          invariant(gasPriceInV2 !== undefined, 'Invalid gas price in v2')
          const gasSpent = estimateGasCost(quoteResult) + getGasSpent(vert)

          const price = priceCalculator.getPrice(v2, finish)
          invariant(
            price !== undefined,
            `Failed to get price, base ${v2.currency.symbol}, quote ${finish.currency.symbol}`,
          )
          const gasSpentInQuote = price.quote(gasPriceInV2.multiply(gasSpent))
          const newQuote = adjustQuoteByGas(price.quote(quote), gasSpentInQuote)
          const bestSource = getBestSource(v2)
          const v2BestQuote = getBestQuote(v2)
          // console.log(
          //   `[GetQuote]: Vertice ${v2.currency.symbol}, prev best quote ${v2BestQuote?.toExact()}, new quote from`,
          //   e.pool,
          //   `: ${newQuote.toExact()}`,
          // )

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
  const routes: V4Route[] = []
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
  const finalGraph = createGraph({ graph: graphOverride, pools: candidatePools })
  const s = finalGraph.getVertice(baseCurrency)
  invariant(s !== undefined, '[Graph rebuild]: Invalid start vertice')
  const pc = createPriceCalculator({ quote: s, gasPriceWei: gasPrice, graph: finalGraph })
  const finalRoutes: V4Route[] = []
  for (const r of routes) {
    // eslint-disable-next-line no-await-in-loop
    const { amount, quote: quoteRaw, gasCost } = await finalGraph.applySwap({ isExactIn, route: r })
    const quote = CurrencyAmount.fromRawAmount(quoteCurrency, quoteRaw.quotient)
    const gasUseEstimateBase = getGasCostInCurrency({ priceCalculator: pc, gasCost, currency: baseCurrency })
    const gasUseEstimateQuote = getGasCostInCurrency({ priceCalculator: pc, gasCost, currency: quoteCurrency })
    const quoteAmountWithGasAdjusted = CurrencyAmount.fromRawAmount(
      quoteCurrency,
      gasUseEstimateQuote ? adjustQuoteByGas(quote, gasUseEstimateQuote).quotient : 0,
    )
    finalRoutes.push({
      ...r,
      gasUseEstimate: gasCost,
      inputAmount: getInputAmount(amount, quote),
      outputAmount: getOutputAmount(amount, quote),
      inputAmountWithGasAdjusted: getInputAmount(amount, quoteAmountWithGasAdjusted),
      outputAmountWithGasAdjusted: getOutputAmount(amount, quoteAmountWithGasAdjusted),
      gasUseEstimateQuote,
      gasUseEstimateBase,
    })
  }
  return buildTrade(finalGraph, finalRoutes)
}
