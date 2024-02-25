import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { Address } from 'viem'
import invariant from 'tiny-invariant'

import { Pool } from '../../v3-router/types'
import { createPoolQuoteGetter } from '../../v3-router/providers'
import { getPoolAddress } from '../../v3-router/utils'
import { V4Trade, Edge, Vertice, Graph, TradeConfig } from '../types'
import { getCurrencyPairs } from '../pool'
import { getNeighbour } from './edge'
import { createPriceCalculator } from './priceCalculator'
import { estimateGasCost } from '../gasCost'

type GraphParams = {
  pools: Pool[]
}

export function createGraph({ pools }: GraphParams): Graph {
  const verticeMap = new Map<Address, Vertice>()
  const edgeMap = new Map<Address, Edge>()

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
    const poolAddress = getPoolAddress(p)
    if (!poolAddress) {
      throw new Error(`Create edge failed. Cannot get valid pool address for pool ${p}`)
    }
    const e = edgeMap.get(poolAddress)
    if (e) {
      return e
    }
    const edge: Edge = {
      vertice0,
      vertice1,
      pool: p,
    }
    edgeMap.set(poolAddress, edge)
    return edge
  }

  return {
    vertices: Array.from(verticeMap.values()),
    edges: Array.from(edgeMap.values()),
    getVertice,
  }
}

type FindBestTradeParams = Omit<TradeConfig, 'candidatePools'> & {
  graph: Graph
}

export async function findBestTradeFromGraph({
  amount,
  graph,
  quoteCurrency,
  gasPriceWei,
}: FindBestTradeParams): Promise<V4Trade<TradeType>> {
  // TODO: exact input & output
  const getPoolQuote = createPoolQuoteGetter(true)
  const gasPrice = BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)

  // 1. Set static prices for each vertices
  const start = graph.getVertice(amount.currency)
  const finish = graph.getVertice(quoteCurrency)
  if (!start || !finish) {
    throw new Error(`Invalid start vertice or finish vertice. Start ${start}, finish ${finish}`)
  }
  const priceCalculator = createPriceCalculator({ quote: start, gasPriceWei: gasPrice, graph })

  // 2. Find best path using Dijkstra's algo
  async function findBestPath(baseAmount: CurrencyAmount<Currency>) {
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

    for (;;) {
      const { vert, index } = getNextVert()
      if (!vert || index === undefined) return undefined

      if (vert === finish) {
        const path: Pool[] = []
        for (let v: Vertice | undefined = finish; getBestSource(v); v = getNeighbour(getBestSource(v)!, v)) {
          const bestSource = getBestSource(v)
          invariant(bestSource !== undefined, 'Invalid best source')
          path.unshift(bestSource.pool)
        }
        const gasCost = getGasSpent(vert)
        const gasPriceInQuote = priceCalculator.getGasPriceInBase(vert)
        const gasCostInQuote = gasPriceInQuote?.multiply(gasCost)
        const outputAmount = getBestAmount(vert)
        const outputAmountWithGasAdjusted = gasCostInQuote ? outputAmount?.subtract(gasCostInQuote) : undefined
        return {
          path,
          gasCost,
          inputAmount: baseAmount,
          outputAmount,
          outputAmountWithGasAdjusted,
        }
      }
      nextVertList.splice(index, 1)

      for (const e of vert.edges) {
        const v2 = vert === e.vertice0 ? e.vertice1 : e.vertice0
        if (processedVert.has(v2)) continue

        try {
          const bestAmount = getBestAmount(vert)
          invariant(bestAmount !== undefined, 'Invalid amount')
          console.log(
            `Get quote ${(e.pool as any).token0.symbol} ${(e.pool as any).token1.symbol} ${(e.pool as any).fee}`,
          )
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
          const newQuote = price.quote(quote).subtract(gasSpentInQuote)
          const bestSource = getBestSource(v2)
          const v2BestQuote = getBestQuote(v2)

          if (!bestSource) nextVertList.push(v2)
          if (!bestSource || !v2BestQuote || newQuote?.greaterThan(v2BestQuote)) {
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

  return findBestPath(amount) as any as V4Trade<TradeType>
}
