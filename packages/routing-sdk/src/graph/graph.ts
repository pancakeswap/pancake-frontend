import { Currency } from '@pancakeswap/swap-sdk-core'
import memoize from 'lodash/memoize.js'
import invariant from 'tiny-invariant'

import { Address, Pool, Edge, Vertice, Graph } from '../types'
import { getNeighbour } from './edge'

type GraphParams = {
  pools?: Pool[]

  // If graph is provided, will clone it without creating new graph from pools
  graph?: Graph
}

function getEdgeKey(p: Pool, vertA: Vertice, vertB: Vertice): string {
  const [vert0, vert1] = vertA.currency.wrapped.sortsBefore(vertB.currency.wrapped) ? [vertA, vertB] : [vertB, vertA]
  return `${vert0.currency.chainId}-${vert0.currency.wrapped.address}-${vert1.currency.wrapped.address}-${p.getId()}`
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
    const pairs = p.getTradingPairs()
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
    hasValidRouteToVerticeWithinHops,
    vertices: Array.from(verticeMap.values()),
    edges: Array.from(edgeMap.values()),
    getVertice,
    getEdge,

    applySwap: async ({ isExactIn, route }) => {
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
      let gasUseEstimate = 0n
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
        const quoteCurrency = quote.currency.wrapped.equals(vertA.currency.wrapped) ? vertB.currency : vertA.currency
        // eslint-disable-next-line no-await-in-loop
        const quoteResult = edge.pool.getQuote({
          amount: quote,
          isExactIn,
          quoteCurrency,
        })
        invariant(quoteResult !== undefined, '[Apply swap]: Failed to get quote')
        edge.pool = quoteResult.poolAfter
        quote = quoteResult.quote
        gasUseEstimate += edge.pool.estimateGasCostForQuote(quoteResult)
      }
      return {
        amount,
        quote,
        gasUseEstimate,
      }
    },
  }
}
