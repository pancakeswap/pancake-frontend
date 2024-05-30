import type { Edge, Pool, Vertice } from '../types'

export function getNeighbour(e: Edge, v: Vertice): Vertice {
  return e.vertice0.currency.equals(v.currency) ? e.vertice1 : e.vertice0
}

export function getEdgeKey(p: Pool, vertA: Vertice, vertB: Vertice): string {
  const [vert0, vert1] = vertA.currency.wrapped.sortsBefore(vertB.currency.wrapped) ? [vertA, vertB] : [vertB, vertA]
  return `${vert0.currency.chainId}-${vert0.currency.wrapped.address}-${vert1.currency.wrapped.address}-${p.getId()}`
}
