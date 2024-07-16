import { safeGetAddress } from 'utils'
import { PoolData } from '../types'

export function shortenAddress(address: string, chars = 4): string {
  const parsed = safeGetAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
export function feeTierPercent(fee: number): string {
  return `${fee / 10_000}%`
}

export const currentTimestamp = () => new Date().getTime()

export function transformPoolData(item: any): PoolData {
  return {
    ...item,
    address: item.id,
    volumeUSD: parseFloat(item.volumeUSD24h),
    volumeUSDWeek: parseFloat(item.volumeUSD7d),
    token0: { ...item.token0, address: item.token0.id, derivedETH: 0 },
    token1: { ...item.token1, address: item.token1.id, derivedETH: 0 },
    feeUSD: item.totalFeeUSD,
    liquidity: parseFloat(item.liquidity),
    sqrtPrice: parseFloat(item.sqrtPrice),
    tick: item.tick ?? 0,
    tvlUSD: parseFloat(item.tvlUSD),
    token0Price: parseFloat(item.token0Price),
    token1Price: parseFloat(item.token1Price),
    tvlToken0: parseFloat(item.tvlToken0),
    tvlToken1: parseFloat(item.tvlToken1),
    volumeUSDChange: 0,
    tvlUSDChange: 0,
  }
}
