import { Currency } from '@pancakeswap/sdk'

import { Pool, Route } from '../../v3-router/types'

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
  applySwap: (params: {
    route: Pick<Route, 'pools' | 'path' | 'inputAmount' | 'outputAmount'>
    isExactIn: boolean
  }) => Promise<void>
}
