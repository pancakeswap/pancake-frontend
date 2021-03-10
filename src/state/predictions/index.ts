/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PredictionsState, PredictionStatus, Round } from 'state/types'
import { getPastRounds } from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  currentEpoch: 0,
  rounds: {},
}

type InitializeReturn = {
  currentEpoch: number
  rounds: Round[]
}

export const initializePredictions = createAsyncThunk<InitializeReturn>('predictions/initialize', async () => {
  const data = await getPastRounds()
  return data
})

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializePredictions.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(initializePredictions.fulfilled, (state, action: PayloadAction<InitializeReturn>) => {
      return {
        status: PredictionStatus.LIVE,
        isLoading: false,
        currentEpoch: action.payload.currentEpoch,
        rounds: action.payload.rounds.reduce((accum, roundResponse) => {
          return {
            ...accum,
            [roundResponse.epoch]: roundResponse,
          }
        }, {}),
      }
    })
  },
})

export default predictionsSlice.reducer
