import { ComputedFarmConfigV3 } from '@pancakeswap/farms'

export interface Block {
  number: number
  timestamp: string
}

export interface TvlChartEntry {
  date: number
  liquidityUSD: number
}

export interface VolumeChartEntry {
  date: number
  volumeUSD: number
}

/**
 * Formatted type for Candlestick charts
 */
export interface PriceChartEntry {
  time: number
  open: number
  close: number
  high: number
  low: number
}

export enum TransactionType {
  SWAP,
  MINT,
  BURN,
}

export type Transaction = {
  type: TransactionType
  hash: string
  timestamp: string
  sender: string
  token0Symbol?: string
  token1Symbol?: string
  token0Address?: string
  token1Address?: string
  amountUSD: number
  amountToken0: number
  amountToken1: number
}

export interface ProtocolData {
  volumeUSD: number
  volumeUSDChange: number // in 24h, as percentage

  liquidityUSD: number
  liquidityUSDChange: number // in 24h, as percentage

  txCount: number
  txCountChange: number
}
// POOLS

export type PoolProtocol = 'v2' | 'v3' | 'stable'

export interface PoolData {
  address: string
  lpAddress?: string
  protocol?: PoolProtocol
  timestamp: number

  token0: {
    name: string
    symbol: string
    address: string
    decimals: number
  }

  token1: {
    name: string
    symbol: string
    address: string
    decimals: number
  }

  volumeUSD: number
  volumeOutUSD?: number
  volumeUSDChange: number
  volumeUSDWeek: number
  volumeOutUSDWeek?: number
  volumeUSDChangeWeek: number

  totalFees24h: number
  totalFees7d: number
  lpFees24h: number
  lpFees7d: number
  lpApr7d: number

  liquidityUSD: number
  liquidityUSDChange: number

  token0Price: number
  token1Price: number

  liquidityToken0: number
  liquidityToken1: number
}
// TOKENS

export type TokenData = {
  exists: boolean

  name: string
  symbol: string
  address: string
  decimals: number

  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  txCount: number

  liquidityToken: number
  liquidityUSD: number
  liquidityUSDChange: number

  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number

  campaignId?: string
  pairs?: ComputedFarmConfigV3[]
}
export enum InfoDataSource {
  V3,
  V2,
}
