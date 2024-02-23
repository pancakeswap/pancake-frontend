import { Currency } from '@pancakeswap/sdk'

import { Pool } from '../../v3-router/types'

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
}
