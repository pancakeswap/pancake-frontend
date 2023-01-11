export interface Block {
  number: number
  timestamp: string
}

export interface ChartEntry {
  date: number
  volumeUSD: number
  liquidityUSD: number
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
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
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

export interface ProtocolState {
  readonly overview?: ProtocolData

  readonly chartData?: ChartEntry[]

  readonly transactions?: Transaction[]
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

export interface PoolsState {
  byAddress: {
    [address: string]: {
      data?: PoolData
      chartData?: ChartEntry[]
      transactions?: Transaction[]
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

  liquidityToken: number
  liquidityUSD: number
  liquidityUSDChange: number

  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
}

export interface TokensState {
  byAddress: {
    [address: string]: {
      data?: TokenData
      poolAddresses?: string[]
      chartData?: ChartEntry[]
      priceData: {
        oldestFetchedTimestamp?: number
        [secondsInterval: number]: PriceChartEntry[] | undefined
      }
      transactions?: Transaction[]
    }
  }
}

// Info redux state
export interface InfoState {
  protocol: ProtocolState
  pools: PoolsState
  tokens: TokensState
}
