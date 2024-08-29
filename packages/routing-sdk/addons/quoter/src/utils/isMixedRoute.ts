import type { Pool } from '@pancakeswap/routing-sdk'

type Route<P extends Pool> = {
  pools: P[]
}

export function isMixedRoute<P extends Pool = Pool>({ pools }: Route<P>): boolean {
  let lastType
  for (const p of pools) {
    if (lastType === undefined) {
      lastType = p.type
      continue
    }
    if (lastType !== p.type) {
      return true
    }
  }
  return false
}
