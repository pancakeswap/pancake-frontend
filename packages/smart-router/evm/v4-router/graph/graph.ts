import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'
import { Address } from 'viem'
import invariant from 'tiny-invariant'

import { Pool } from '../../v3-router/types'
import { V4Trade, Edge, Vertice, Graph } from '../types'
import { getCurrencyPairs, getReserve } from '../pool'
import { getPoolAddress, getTokenPrice } from '../../v3-router/utils'
import { getNeighbour } from './edge'

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
      vertice0.edges.push(edge)
      vertice1.edges.push(edge)
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
  graph: Graph
}

export function findBestTradeFromGraph({ amount, graph }: FindBestTradeParams): V4Trade<TradeType> {
  // 1. Set static prices for each vertices
  const start = graph.getVertice(amount.currency)
  if (!start) {
    throw new Error(`Cannot find valid vertice for start currency ${amount.currency.symbol}`)
  }
  const priceCalculator = createPriceCalculator(graph, start)

  return {} as V4Trade<TradeType>
}

// Get the price reference of all tokens in the graph against the specified vertice
function createPriceCalculator(graph: Graph, quote: Vertice) {
  const priceMap = new Map<Vertice, Price<Currency, Currency>>()
  const processedVert = new Set<Vertice>()
  const edgeWeight = new Map<Edge, bigint>()
  let nextEdges: Edge[] = []
  const getWeight = (e: Edge) => {
    const weight = edgeWeight.get(e)
    if (weight === undefined) {
      throw new Error(`Invalid weight for edge ${e}`)
    }
    return weight
  }

  // anchor price
  priceMap.set(quote, new Price(quote.currency, quote.currency, 1, 1))
  nextEdges = getNextEdges(quote)
  processedVert.add(quote)

  while (nextEdges.length) {
    const bestEdge = nextEdges.pop() as Edge
    const [vFrom, vTo] = processedVert.has(bestEdge.vertice1)
      ? [bestEdge.vertice1, bestEdge.vertice0]
      : [bestEdge.vertice0, bestEdge.vertice1]
    if (processedVert.has(vTo)) continue
    const p = getTokenPrice(bestEdge.pool, vTo.currency, vFrom.currency)
    const vFromQuotePrice = getQuotePrice(vFrom)
    invariant(vFromQuotePrice !== undefined, 'Invalid quote price')
    priceMap.set(vTo, p.multiply(vFromQuotePrice))
    nextEdges = getNextEdges(vTo)
    processedVert.add(vTo)
    console.log(
      `Pricing: + Token ${vTo.currency.symbol} price=${getQuotePrice(vTo)?.toSignificant(6)}` +
        ` from ${vFrom.currency.symbol} pool=${getPoolAddress(bestEdge.pool)} liquidity=${getWeight(bestEdge)}`,
    )
  }

  function getNextEdges(v: Vertice) {
    const price = priceMap.get(v)
    if (!price) {
      throw new Error('Invalid price')
    }
    const newEdges = v.edges.filter((e) => {
      if (processedVert.has(getNeighbour(e, v))) {
        return false
      }
      const tokenReserve = getReserve(e.pool, v.currency)
      invariant(tokenReserve !== undefined, 'Unexpected empty token reserve')
      const liquidity = price.quote(tokenReserve).quotient
      edgeWeight.set(e, liquidity)
      return true
    })
    newEdges.sort((e1, e2) => (getWeight(e1) - getWeight(e2) > 0n ? 1 : -1))
    const res: Edge[] = []
    while (nextEdges.length && newEdges.length) {
      if (getWeight(nextEdges[0]) < getWeight(newEdges[0])) {
        res.push(nextEdges.shift() as Edge)
      } else {
        res.push(newEdges.shift() as Edge)
      }
    }
    return [...res, ...nextEdges, ...newEdges]
  }

  function getPrice(base: Vertice, targetQuote: Vertice): Price<Currency, Currency> | undefined {
    const basePrice = getQuotePrice(base)
    const quotePrice = getQuotePrice(targetQuote)
    return basePrice && quotePrice ? basePrice.multiply(quotePrice.invert()) : undefined
  }

  function getQuotePrice(base: Vertice): Price<Currency, Currency> | undefined {
    return priceMap.get(base)
  }

  return {
    getQuotePrice,
    getPrice,
  }
}
