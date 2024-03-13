import { Edge, Vertice } from '../types'

export function getNeighbour(e: Edge, v: Vertice): Vertice {
  return e.vertice0.currency.equals(v.currency) ? e.vertice1 : e.vertice0
}
