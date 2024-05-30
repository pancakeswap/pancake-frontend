import type { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import type { Pool } from './pool'
import type { Route } from './route'

export type Edge = {
  vertice0: Vertice
  vertice1: Vertice
  pool: Pool
}

export type Vertice = {
  currency: Currency
  edges: Edge[]
}

export type Graph = {
  vertices: Vertice[]
  edges: Edge[]

  getVertice: (currency: Currency) => Vertice | undefined
  getEdge: (pool: Pool, vertA: Vertice, vertB: Vertice) => Edge | undefined

  hasValidRouteToVerticeWithinHops: (
    vertice: Vertice,
    target: Vertice,
    hops: number,
    visitedVertices?: Set<Vertice>,
  ) => boolean

  applySwap: (params: {
    route: Pick<Route, 'pools' | 'path'> & {
      inputAmount?: CurrencyAmount<Currency>
      outputAmount?: CurrencyAmount<Currency>
    }
    isExactIn: boolean
  }) => Promise<{
    gasUseEstimate: bigint
    quote: CurrencyAmount<Currency>
    amount: CurrencyAmount<Currency>
  }>
}
