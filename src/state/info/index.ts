/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { InfoState } from './types'
import {
  updateProtocolData,
  updateProtocolChartData,
  updateProtocolTransactions,
  updatePoolData,
  addPoolKeys,
  updatePoolChartData,
  updatePoolTransactions,
  updateTokenData,
  addTokenKeys,
  addTokenPoolAddresses,
  updateTokenChartData,
  updateTokenPriceData,
  updateTokenTransactions,
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
    .addCase(updateProtocolChartData, (state, { payload: { chartData } }) => {
      state.protocol.chartData = chartData
    })
    .addCase(updateProtocolTransactions, (state, { payload: { transactions } }) => {
      state.protocol.transactions = transactions
    })
    // Pools actions
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.forEach((poolData) => {
        state.pools.byAddress[poolData.address] = {
          ...state.pools.byAddress[poolData.address],
          data: poolData,
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
          }
        }
      })
    })
    .addCase(updatePoolChartData, (state, { payload: { poolAddress, chartData } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], chartData }
    })
    .addCase(updatePoolTransactions, (state, { payload: { poolAddress, transactions } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], transactions }
    })
    // Tokens actions
    .addCase(updateTokenData, (state, { payload: { tokens } }) => {
      tokens.forEach((tokenData) => {
        state.tokens.byAddress[tokenData.address] = {
          ...state.tokens.byAddress[tokenData.address],
          data: tokenData,
        }
      })
    })
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses } }) => {
      tokenAddresses.forEach((address) => {
        if (!state.tokens.byAddress[address]) {
          state.tokens.byAddress[address] = {
            poolAddresses: undefined,
            data: undefined,
            chartData: undefined,
            priceData: {},
            transactions: undefined,
          }
        }
      })
    })
    .addCase(addTokenPoolAddresses, (state, { payload: { tokenAddress, poolAddresses } }) => {
      state.tokens.byAddress[tokenAddress] = { ...state.tokens.byAddress[tokenAddress], poolAddresses }
    })
    .addCase(updateTokenChartData, (state, { payload: { tokenAddress, chartData } }) => {
      state.tokens.byAddress[tokenAddress] = { ...state.tokens.byAddress[tokenAddress], chartData }
    })
    .addCase(updateTokenTransactions, (state, { payload: { tokenAddress, transactions } }) => {
      state.tokens.byAddress[tokenAddress] = { ...state.tokens.byAddress[tokenAddress], transactions }
    })
    .addCase(
      updateTokenPriceData,
      (state, { payload: { tokenAddress, secondsInterval, priceData, oldestFetchedTimestamp } }) => {
        state.tokens.byAddress[tokenAddress] = {
          ...state.tokens.byAddress[tokenAddress],
          priceData: {
            ...state.tokens.byAddress[tokenAddress].priceData,
            [secondsInterval]: priceData,
            oldestFetchedTimestamp,
          },
        }
      },
    ),
)
