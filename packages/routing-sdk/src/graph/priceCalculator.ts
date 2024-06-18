import { type Currency, CurrencyAmount, Price } from '@pancakeswap/swap-sdk-core'
import { Native } from '@pancakeswap/swap-sdk-evm'
import invariant from 'tiny-invariant'

import { Edge, Graph, Vertice } from '../types'
import { getNeighbour } from './edge'

type Params = {
  graph: Graph
  quote: Vertice
  gasPriceWei: bigint
}

export type PriceCalculator = ReturnType<typeof createPriceCalculator>

// Get the price reference of all tokens in the graph against the specified vertice
export function createPriceCalculator({ graph, quote, gasPriceWei }: Params) {
  const { chainId } = quote.currency
  const priceMap = new Map<Vertice, Price<Currency, Currency>>()
  const priceSources = new Map<Vertice, Edge[]>()
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
    const p = bestEdge.pool.getCurrentPrice(vTo.currency, vFrom.currency)
    const vFromQuotePrice = getQuotePrice(vFrom)
    invariant(vFromQuotePrice !== undefined, 'Invalid quote price')
    priceMap.set(vTo, p.multiply(vFromQuotePrice))
    priceSources.set(vTo, [...(priceSources.get(vFrom) || []), bestEdge])
    nextEdges = getNextEdges(vTo)
    processedVert.add(vTo)
    // console.log(
    //   `Pricing: + Token ${vTo.currency.symbol} price=${getQuotePrice(vTo)?.toSignificant(6)}` +
    //     ` from ${vFrom.currency.symbol} pool=${getPoolAddress(bestEdge.pool)} liquidity=${getWeight(bestEdge)}`,
    // )
  }

  const native = Native.onChain(chainId).wrapped
  const nativeVertice = graph.getVertice(native)
  if (!nativeVertice) {
    throw new Error('No valid native currency price found')
  }
  const nativePriceInQuote = getQuotePrice(nativeVertice)
  const gasPriceInQuote = nativePriceInQuote?.quote(CurrencyAmount.fromRawAmount(native, gasPriceWei))
  if (!gasPriceInQuote) {
    throw new Error('Failed to get gas price in quote')
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
      const tokenReserve = e.pool.getReserve(v.currency)
      invariant(tokenReserve !== undefined, 'Unexpected empty token reserve')
      const liquidity = price.quote(tokenReserve).quotient
      edgeWeight.set(e, liquidity)
      return true
    })
    newEdges.sort((e1, e2) => Number(getWeight(e1) - getWeight(e2)))
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

  function getGasPriceInBase(base: Vertice): CurrencyAmount<Currency> | undefined {
    const basePrice = getQuotePrice(base)
    return gasPriceInQuote ? basePrice?.invert().quote(gasPriceInQuote) : undefined
  }

  function getPriceSources(v: Vertice) {
    return priceSources.get(v) || []
  }

  return {
    graph,
    getGasPriceInBase,
    getQuotePrice,
    getPrice,
    getPriceSources,
  }
}
