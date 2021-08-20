/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { InfoState } from './types'
import { updateProtocolData, updateChartData, updateTransactions } from './actions'

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
    .addCase(updateProtocolData, (state, { payload: { protocolData } }) => {
      state.protocol.overview = protocolData
    })
    .addCase(updateChartData, (state, { payload: { chartData } }) => {
      state.protocol.chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions } }) => {
      state.protocol.transactions = transactions
    }),
)
