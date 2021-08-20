import { createAction } from '@reduxjs/toolkit'
import { ChartDayData, Transaction, PoolData, PoolChartEntry, PriceChartEntry } from 'types'
import { ProtocolData, TokenData, TokenChartEntry } from './types'

export const updateProtocolData = createAction<{ protocolData: ProtocolData }>('info/protocol/updateProtocolData')
export const updateProtocolChartData = createAction<{ chartData: ChartDayData[] }>(
  'info/protocol/updateProtocolChartData',
)
export const updateProtocolTransactions = createAction<{ transactions: Transaction[] }>(
  'info/protocol/updateProtocolTransactions',
)

export const updatePoolData = createAction<{ pools: PoolData[] }>('info/pools/updatePoolData')
export const addPoolKeys = createAction<{ poolAddresses: string[] }>('info/pools/addPoolKeys')
export const updatePoolChartData = createAction<{ poolAddress: string; chartData: PoolChartEntry[] }>(
  'info/pools/updatePoolChartData',
)
export const updatePoolTransactions = createAction<{ poolAddress: string; transactions: Transaction[] }>(
  'info/pools/updatePoolTransactions',
)

export const updateTokenData = createAction<{ tokens: TokenData[] }>('info/tokens/updateTokenData')
export const addTokenKeys = createAction<{ tokenAddresses: string[] }>('info/tokens/addTokenKeys')
export const addTokenPoolAddresses = createAction<{ tokenAddress: string; poolAddresses: string[] }>(
  'info/tokens/addTokenPoolAddresses',
)
export const updateTokenChartData = createAction<{ tokenAddress: string; chartData: TokenChartEntry[] }>(
  'info/tokens/updateTokenChartData',
)
export const updateTokenTransactions = createAction<{ tokenAddress: string; transactions: Transaction[] }>(
  'info/tokens/updateTokenTransactions',
)
export const updateTokenPriceData = createAction<{
  tokenAddress: string
  secondsInterval: number
  priceData: PriceChartEntry[] | undefined
  oldestFetchedTimestamp: number
}>('info/tokens/updateTokenPriceData')
