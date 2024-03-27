import { PoolType } from '@pancakeswap/smart-router'

export function getPoolType(type: string): PoolType | undefined {
  return PoolType[type as keyof typeof PoolType]
}
