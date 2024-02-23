import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'
import { Address } from 'viem'
import invariant from 'tiny-invariant'

import { Pool } from '../../v3-router/types'
import { V4Trade, Edge, Vertice, Graph } from '../types'
import { getCurrencyPairs, getReserve } from '../pool'
import { getPoolAddress, getTokenPrice } from '../../v3-router/utils'
import { getNeighbour } from './edge'
import { createPriceCalculator } from './priceCalculator'
import { createPoolQuoteGetter } from '../../v3-router/providers'

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

type FindBestTradeParams = {
  amount: CurrencyAmount<Currency>
  quoteCurrency: Currency
  graph: Graph
}

export async function findBestTradeFromGraph({
  amount,
  graph,
  quoteCurrency,
}: FindBestTradeParams): Promise<V4Trade<TradeType>> {
  // TODO: exact input & output
  const getPoolQuote = createPoolQuoteGetter(true)

  // 1. Set static prices for each vertices
  const start = graph.getVertice(amount.currency)
  const finish = graph.getVertice(quoteCurrency)
  if (!start || !finish) {
    throw new Error(`Invalid start vertice or finish vertice. Start ${start}, finish ${finish}`)
  }
  const priceCalculator = createPriceCalculator(start)

  // 2. Find best path using Dijkstra's algo
  async function findBestPath(baseAmount: CurrencyAmount<Currency>) {
    invariant(start !== undefined && finish !== undefined, 'Invalid start/finish vertice')
    const bestResult = new Map<
      Vertice,
      {
        bestAmount: CurrencyAmount<Currency>
        bestQuote?: CurrencyAmount<Currency>
        bestSource?: Edge
      }
    >()
    const processedVert = new Set<Vertice>()
    bestResult.set(start, {
      bestAmount: amount,
    })
    const nextVertList: Vertice[] = [start]
    const getBestAmount = (vert: Vertice) => bestResult.get(vert)?.bestAmount
    const getBestQuote = (vert: Vertice) => bestResult.get(vert)?.bestQuote
    const getBestSource = (vert: Vertice) => bestResult.get(vert)?.bestSource
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
        const bestPath: Edge[] = []
        for (let v: Vertice | undefined = finish; getBestSource(v); v = getNeighbour(getBestSource(v)!, v)) {
          bestPath.unshift(getBestSource(v)!)
        }
        return {
          path: bestPath,
          inputAmount: baseAmount,
          outputAmount: getBestAmount(finish),
        }
      }
      nextVertList.splice(index, 1)

      for (const e of vert.edges) {
        const v2 = vert === e.vertice0 ? e.vertice1 : e.vertice0
        if (processedVert.has(v2)) continue

        let quoteV2Amount: CurrencyAmount<Currency> | undefined
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

          quoteV2Amount = quote
        } catch (_err) {
          console.error(_err)
          continue
        }
        const price = priceCalculator.getPrice(v2, finish)
        const newQuote = price?.quote(quoteV2Amount)
        const bestSource = getBestSource(v2)
        const v2BestQuote = getBestQuote(v2)

        if (!bestSource) nextVertList.push(v2)
        if (!bestSource || !v2BestQuote || newQuote?.greaterThan(v2BestQuote)) {
          bestResult.set(v2, {
            bestAmount: quoteV2Amount,
            bestSource: e,
            bestQuote: newQuote,
          })
        }
      }
      processedVert.add(vert)
    }
  }

  return findBestPath(amount) as any as V4Trade<TradeType>
}
