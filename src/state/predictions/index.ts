/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PredictionsState, PredictionStatus, RoundResponse } from 'state/types'
import { getInitialRounds } from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  currentEpoch: 0,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  rounds: {},
}

type InitializeReturn = {
  currentEpoch: number
  rounds: RoundResponse[]
}

export const initializePredictions = createAsyncThunk<InitializeReturn>('predictions/initialize', async () => {
  const data = await getInitialRounds()
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
      state.status = PredictionStatus.LIVE
      state.currentEpoch = action.payload.currentEpoch
      state.rounds = action.payload.rounds.reduce((accum, roundResponse) => {
        return {
          ...accum,
          [roundResponse.epoch]: roundResponse,
        }
      }, {})
    })
  },
})

// Actions
export const { setChartPaneState, setHistoryPaneState } = predictionsSlice.actions

export default predictionsSlice.reducer
