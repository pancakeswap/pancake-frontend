import type { Pool } from '@pancakeswap/routing-sdk'
import { isV3Pool } from '@pancakeswap/routing-sdk-addon-v3'

type Route<P extends Pool> = {
  pools: P[]
}

export function isV3Route<P extends Pool = Pool>({ pools }: Route<P>): boolean {
  return pools.every((p) => isV3Pool(p))
}
