import { ChartDayData, PriceChartEntry, Transaction } from 'types'

export interface ProtocolData {
  volumeUSD: number
  volumeUSDChange: number // in 24h, as percentage

  liquidityUSD: number
  liquidityUSDChange: number // in 24h, as percentage

  txCount: number
  txCountChange: number
}

export interface ProtocolState {
  readonly overview: ProtocolData | undefined

  readonly chartData: ChartDayData[] | undefined

  readonly transactions: Transaction[] | undefined
}

// POOLS

export interface PoolData {
  address: string

  token0: {
    name: string
    symbol: string
    address: string
  }

  token1: {
    name: string
    symbol: string
    address: string
  }

  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  volumeUSDChangeWeek: number

  totalFees24h: number
  totalFees7d: number
  lpFees24h: number
  lpFees7d: number
  lpApr7d: number

  tvlUSD: number
  tvlUSDChange: number

  token0Price: number
  token1Price: number

  tvlToken0: number
  tvlToken1: number
}

export type PoolChartEntry = {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
}

export interface PoolsState {
  byAddress: {
    [address: string]: {
      data: PoolData | undefined
      chartData: PoolChartEntry[] | undefined
      transactions: Transaction[] | undefined
    }
  }
}

// TOKENS

export type TokenData = {
  exists: boolean

  name: string
  symbol: string
  address: string

  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  txCount: number

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

export interface TokensState {
  byAddress: {
    [address: string]: {
      data: TokenData | undefined
      poolAddresses: string[] | undefined
      chartData: TokenChartEntry[] | undefined
      priceData: {
        oldestFetchedTimestamp?: number | undefined
        [secondsInterval: number]: PriceChartEntry[] | undefined
      }
      transactions: Transaction[] | undefined
    }
  }
}

// Info redux state
export interface InfoState {
  protocol: ProtocolState
  pools: PoolsState
  tokens: TokensState
}
