import { PoolType } from '@pancakeswap/smart-router'

import type { PoolTypeKey } from './types'

export function getPoolType(type: string): PoolType | undefined {
  return PoolType[type as PoolTypeKey]
}

export function getPoolTypeKey(poolType: PoolType): PoolTypeKey {
  for (const [key, value] of Object.entries(PoolType)) {
    if (value === poolType) {
      return key as PoolTypeKey
    }
  }
  throw new Error(`Invalid pool type: ${poolType}`)
}
