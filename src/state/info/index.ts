/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { currentTimestamp } from 'utils/infoUtils'
import { InfoState } from './types'
import {
  updateProtocolData,
  updateChartData,
  updateTransactions,
  updatePoolData,
  addPoolKeys,
  updatePoolChartData,
  updatePoolTransactions,
} from './actions'

const initialState: InfoState = {
  protocol: {
    overview: undefined,
    chartData: undefined,
    transactions: undefined,
  },
  pools: { byAddress: {} },
  tokens: { byAddress: {} },
}

export default createReducer(initialState, (builder) =>
  builder
    // Protocol actions
    .addCase(updateProtocolData, (state, { payload: { protocolData } }) => {
      state.protocol.overview = protocolData
    })
    .addCase(updateChartData, (state, { payload: { chartData } }) => {
      state.protocol.chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions } }) => {
      state.protocol.transactions = transactions
    })
    // Pools actions
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.forEach((poolData) => {
        state.pools.byAddress[poolData.address] = {
          ...state.pools.byAddress[poolData.address],
          data: poolData,
          lastUpdated: currentTimestamp(),
        }
      })
    })
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.forEach((address) => {
        if (!state.pools.byAddress[address]) {
          state.pools.byAddress[address] = {
            data: undefined,
            chartData: undefined,
            transactions: undefined,
            lastUpdated: undefined,
          }
        }
      })
    })
    .addCase(updatePoolChartData, (state, { payload: { poolAddress, chartData } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], chartData }
    })
    .addCase(updatePoolTransactions, (state, { payload: { poolAddress, transactions } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], transactions }
    }),
)
