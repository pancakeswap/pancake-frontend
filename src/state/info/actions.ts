import { createAction } from '@reduxjs/toolkit'
import { ChartDayData, Transaction, PoolData, PoolChartEntry, PriceChartEntry } from 'types'
import { ProtocolData, TokenData, TokenChartEntry } from './types'

export const updateProtocolData = createAction<{ protocolData: ProtocolData }>('protocol/updateProtocolData')
export const updateProtocolChartData = createAction<{ chartData: ChartDayData[] }>('protocol/updateProtocolChartData')
export const updateProtocolTransactions = createAction<{ transactions: Transaction[] }>(
  'protocol/updateProtocolTransactions',
)

export const updatePoolData = createAction<{ pools: PoolData[] }>('pools/updatePoolData')
export const addPoolKeys = createAction<{ poolAddresses: string[] }>('pool/addPoolKeys')
export const updatePoolChartData =
  createAction<{ poolAddress: string; chartData: PoolChartEntry[] }>('pool/updatePoolChartData')
export const updatePoolTransactions =
  createAction<{ poolAddress: string; transactions: Transaction[] }>('pool/updatePoolTransactions')

export const updateTokenData = createAction<{ tokens: TokenData[] }>('tokens/updateTokenData')
export const addTokenKeys = createAction<{ tokenAddresses: string[] }>('tokens/addTokenKeys')
export const addTokenPoolAddresses =
  createAction<{ tokenAddress: string; poolAddresses: string[] }>('tokens/addTokenPoolAddresses')
export const updateTokenChartData =
  createAction<{ tokenAddress: string; chartData: TokenChartEntry[] }>('tokens/updateTokenChartData')
export const updateTokenTransactions = createAction<{ tokenAddress: string; transactions: Transaction[] }>(
  'tokens/updateTokenTransactions',
)
export const updateTokenPriceData = createAction<{
  tokenAddress: string
  secondsInterval: number
  priceData: PriceChartEntry[] | undefined
  oldestFetchedTimestamp: number
}>('tokens/updateTokenPriceData')
