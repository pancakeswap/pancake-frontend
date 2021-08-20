import { createAction } from '@reduxjs/toolkit'
import { ChartDayData, Transaction, PoolData, PoolChartEntry } from 'types'
import { ProtocolData } from './types'

export const updateProtocolData = createAction<{ protocolData: ProtocolData }>('protocol/updateProtocolData')
export const updateChartData = createAction<{ chartData: ChartDayData[] }>('protocol/updateChartData')
export const updateTransactions = createAction<{ transactions: Transaction[] }>('protocol/updateTransactions')

export const updatePoolData = createAction<{ pools: PoolData[] }>('pools/updatePoolData')
export const addPoolKeys = createAction<{ poolAddresses: string[] }>('pool/addPoolKeys')
export const updatePoolChartData =
  createAction<{ poolAddress: string; chartData: PoolChartEntry[] }>('pool/updatePoolChartData')
export const updatePoolTransactions =
  createAction<{ poolAddress: string; transactions: Transaction[] }>('pool/updatePoolTransactions')
