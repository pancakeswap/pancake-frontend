import { Currency, CurrencyAmount, TradeType, Fraction } from '@pancakeswap/sdk'
import { Address } from 'viem'
import invariant from 'tiny-invariant'
import { formatFraction } from '@pancakeswap/utils/formatFractions'

import { Pool } from '../../v3-router/types'
import { createPoolQuoteGetter } from '../../v3-router/providers'
import { buildBaseRoute, getPoolAddress } from '../../v3-router/utils'
import { V4Trade, Edge, Vertice, Graph, TradeConfig, V4Route } from '../types'
import { getCurrencyPairs } from '../pool'
import { getNeighbour } from './edge'
import { createPriceCalculator } from './priceCalculator'
import { estimateGasCost } from '../gasCost'
import { isSameRoute, mergeRoute } from './route'

type GraphParams = {
  pools: Pool[]
}

function getEdgeKey(p: Pool, vertA: Vertice, vertB: Vertice): string {
  const [vert0, vert1] = vertA.currency.wrapped.sortsBefore(vertB.currency.wrapped) ? [vertA, vertB] : [vertB, vertA]
  return `${vert0.currency.chainId}-${vert0.currency.wrapped.address}-${
    vert1.currency.wrapped.address
  }-${getPoolAddress(p)}`
}

export function createGraph({ pools }: GraphParams): Graph {
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

  return {
    vertices: Array.from(verticeMap.values()),
    edges: Array.from(edgeMap.values()),
    getVertice,
    getEdge,
    applySwap: async ({ isExactIn, route }) => {
      const getPoolQuote = createPoolQuoteGetter(isExactIn)
      function* loopPath() {
        let i = isExactIn ? 0 : route.path.length - 1
        const next = isExactIn ? () => i++ : () => i--
        const hasNext = isExactIn ? () => i < route.path.length - 1 : () => i >= 1
        for (; hasNext(); next()) {
          yield i
        }
      }

      let amount = route.inputAmount
      for (const i of loopPath()) {
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
        const quote = await getPoolQuote(edge.pool, amount)
        invariant(quote !== undefined, '[Apply swap]: Failed to get quote')
        edge.pool = quote.poolAfter
        amount = quote.quote
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

export async function findBestTrade({
  amount: totalAmount,
  candidatePools,
  quoteCurrency,
  gasPriceWei,
  streams,
  graph: graphOverride,
  tradeType,
}: FindBestTradeParams): Promise<V4Trade<TradeType> | undefined> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const graph = graphOverride || createGraph({ pools: candidatePools })
  const amounts = getStreamedAmounts(totalAmount, streams)

  const getPoolQuote = createPoolQuoteGetter(isExactIn)
  const gasPrice = BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)

  // 1. Set static prices for each vertices
  const start = graph.getVertice(totalAmount.currency)
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

  // 2. Find best route using Dijkstra's algo
  async function findBestRoute(amount: CurrencyAmount<Currency>): Promise<Omit<V4Route, 'percent'> | undefined> {
    invariant(start !== undefined && finish !== undefined, 'Invalid start/finish vertice')
    const bestResult = new Map<
      Vertice,
      {
        gasSpent?: bigint
        bestAmount: CurrencyAmount<Currency>
        bestQuote?: CurrencyAmount<Currency>
        bestSource?: Edge
      }
    >()
    const processedVert = new Set<Vertice>()
    bestResult.set(start, {
      bestAmount: amount,
      gasSpent: 0n,
    })
    const nextVertList: Vertice[] = [start]
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
        if (vert === undefined || bestQuote === undefined || currentBestQuote?.greaterThan(bestQuote)) {
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
      const gasPriceInQuote = priceCalculator.getGasPriceInBase(vert)
      const gasCostInQuoteRaw = gasPriceInQuote?.multiply(gasCost)
      const quoteAmountRaw = getBestAmount(vert)
      invariant(quoteAmountRaw !== undefined, 'Invalid quote amount')
      const quoteAmountWithGasAdjustedRaw = gasCostInQuoteRaw
        ? adjustQuoteByGas(quoteAmountRaw, gasCostInQuoteRaw)
        : undefined
      const quoteAmount = CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmountRaw.quotient)
      const gasCostInQuote =
        gasCostInQuoteRaw && CurrencyAmount.fromRawAmount(quoteCurrency, gasCostInQuoteRaw.quotient)
      const quoteAmountWithGasAdjusted =
        quoteAmountWithGasAdjustedRaw &&
        CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmountWithGasAdjustedRaw.quotient)

      const { type } = buildBaseRoute(pools, start.currency, finish.currency)
      return {
        type,
        path,
        pools,
        gasCost,
        inputAmount: getInputAmount(amount, quoteAmount),
        outputAmount: getOutputAmount(amount, quoteAmount),
        inputAmountWithGasAdjusted: quoteAmountWithGasAdjusted && getInputAmount(amount, quoteAmountWithGasAdjusted),
        outputAmountWithGasAdjusted: quoteAmountWithGasAdjusted && getOutputAmount(amount, quoteAmountWithGasAdjusted),
        gasCostInQuote,
      }
    }

    for (;;) {
      const { vert, index } = getNextVert()
      if (!vert || index === undefined) return undefined

      if (vert === finish) {
        return getBestRoute(vert)
      }
      nextVertList.splice(index, 1)

      for (const e of vert.edges) {
        const v2 = vert === e.vertice0 ? e.vertice1 : e.vertice0
        if (processedVert.has(v2)) continue

        try {
          const bestAmount = getBestAmount(vert)
          invariant(bestAmount !== undefined, 'Invalid amount')
          // eslint-disable-next-line no-await-in-loop
          const quoteResult = await getPoolQuote(e.pool, bestAmount)
          console.log(`Get quote success ${quoteResult?.quote.toExact()}`)
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

          if (!bestSource) nextVertList.push(v2)
          if (!bestSource || !v2BestQuote || isQuoteBetter(newQuote, v2BestQuote)) {
            bestResult.set(v2, {
              gasSpent,
              bestAmount: quote,
              bestSource: e,
              bestQuote: newQuote,
            })
          }
        } catch (_err) {
          console.error(_err)
          continue
        }
      }
      processedVert.add(vert)
    }
  }

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
    routes.push({
      ...route,
      percent,
    })
  }
  // No valid route found
  if (!routes.length) {
    return undefined
  }

  const { gasEstimate, quoteAmount, gasCostInQuote, mergedRoutes } = routes.reduce<{
    mergedRoutes: V4Route[]
    gasEstimate: bigint
    quoteAmount: CurrencyAmount<Currency>
    gasCostInQuote: CurrencyAmount<Currency>
  }>(
    (result, r) => {
      const i = result.mergedRoutes.findIndex((route) => isSameRoute(route, r))
      if (i >= 0) {
        // eslint-disable-next-line no-param-reassign
        result.mergedRoutes[i] = mergeRoute(result.mergedRoutes[i], r)
      } else {
        result.mergedRoutes.push(r)
      }
      return {
        mergedRoutes: result.mergedRoutes,
        gasEstimate: result.gasEstimate + r.gasCost,
        quoteAmount: result.quoteAmount.add(getQuoteAmount(r)),
        gasCostInQuote: r.gasCostInQuote ? result.gasCostInQuote.add(r.gasCostInQuote) : result.gasCostInQuote,
      }
    },
    {
      mergedRoutes: [],
      gasEstimate: 0n,
      quoteAmount: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
      gasCostInQuote: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
    },
  )

  return {
    gasCostInQuote,
    gasEstimate,
    inputAmount: getInputAmount(totalAmount, quoteAmount),
    outputAmount: getOutputAmount(totalAmount, quoteAmount),
    tradeType,
    graph,
    routes: mergedRoutes,
  }
}
