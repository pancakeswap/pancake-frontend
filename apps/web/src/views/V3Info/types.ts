export interface ProtocolData {
  // volume
  volumeUSD: number
  volumeUSDChange: number

  // in range liquidity
  tvlUSD: number
  tvlUSDChange: number

  // fees
  feesUSD: number
  feeChange: number

  // transactions
  txCount: number
  txCountChange: number
}
export interface ChartDayData {
  date: number
  volumeUSD: number
  tvlUSD: number
}

export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}

export enum TransactionType {
  SWAP,
  MINT,
  BURN,
}

export type ApiTransaction = {
  type: 'mint' | 'burn' | 'swap'
  transactionHash: string
  timestamp: Record<string, never> | string
  origin: null | string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: number
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: number
  }
  amountUSD: string
  amount0: string
  amount1: string
}

export type Transaction = {
  type: TransactionType
  hash: string
  timestamp: string
  sender: string
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
  amountUSD: number
  amountToken0: number
  amountToken1: number
}

export type PriceChartEntry = {
  time: number // unix timestamp
  open: number
  close: number
  high: number
  low: number
}

export type TokenData = {
  // token is in some pool on uniswap
  exists: boolean

  // basic token info
  name: string
  symbol: string
  address: string
  decimals: number

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  txCount: number

  // fees
  feesUSD: number

  // tvl
  tvlToken: number
  tvlUSD: number
  tvlUSDChange: number

  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
}

export interface TokenChartEntry {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
}

export type PoolChartEntry = {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
  feesUSD: number
}

export interface ApiPoolData {
  feeTier: number
  id: string
  volumeUSD24h: string
  volumeUSD7d: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: number
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: number
  }
  totalFeeUSD: any
  liquidity: string
  sqrtPrice: string
  tick: number | null
  tvlUSD: string
  token0Price: string
  token1Price: string
  tvlToken0: string
  tvlToken1: string
}

export interface PoolData {
  // basic token info
  address: string
  feeTier: number

  token0: {
    name: string
    symbol: string
    address: string
    decimals: number
    derivedETH: number
  }

  token1: {
    name: string
    symbol: string
    address: string
    decimals: number
    derivedETH: number
  }

  // for tick math
  liquidity: number
  sqrtPrice: number
  tick: number

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number

  // liquidity
  tvlUSD: number
  tvlUSDChange: number

  // prices
  token0Price: number
  token1Price: number

  // token amounts
  tvlToken0: number
  tvlToken1: number

  // 24h fees
  feeUSD
}

export interface GenericChartEntry {
  time: string
  value: number
}

export interface DensityChartEntry {
  index: number
  isCurrent: boolean
  activeLiquidity: number
  price0: number
  price1: number
  tvlToken0: number
  tvlToken1: number
}
