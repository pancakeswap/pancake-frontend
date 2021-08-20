export interface Block {
  number: number
  timestamp: string
}

export interface ChartDayData {
  date: number
  volumeUSD: number
  liquidityUSD: number
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

/**
 * Formatted type for Candlestick charts
 */
export type PriceChartEntry = {
  time: number // unix timestamp
  open: number
  close: number
  high: number
  low: number
}

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}
