/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PredictionsState, PredictionStatus, Round } from 'state/types'
import { initialize } from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  currentEpoch: 0,
  intervalBlocks: 100,
  minBetAmount: '1000000000000000',
  rounds: [],
}

type InitializeReturn = {
  status: PredictionStatus
  currentEpoch: number
  intervalBlocks: number
  minBetAmount: string
  rounds: Round[]
}

export const initializePredictions = createAsyncThunk<InitializeReturn>('predictions/initialize', async () => {
  const data = await initialize()
  return data
})

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setHistoryPaneState: (state, action: PayloadAction<boolean>) => {
      state.isHistoryPaneOpen = action.payload
    },
    setChartPaneState: (state, action: PayloadAction<boolean>) => {
      state.isChartPaneOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializePredictions.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(initializePredictions.fulfilled, (state, action: PayloadAction<InitializeReturn>) => {
      const { status, currentEpoch, intervalBlocks, minBetAmount, rounds } = action.payload

      return {
        isLoading: false,
        isHistoryPaneOpen: false,
        isChartPaneOpen: false,
        status,
        currentEpoch,
        intervalBlocks,
        minBetAmount,
        rounds,
      }
    })
  },
})

// Actions
export const { setChartPaneState, setHistoryPaneState } = predictionsSlice.actions

export default predictionsSlice.reducer
