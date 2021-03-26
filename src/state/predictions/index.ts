/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { maxBy } from 'lodash'
import { PredictionsState, PredictionStatus, Round, RoundData } from 'state/types'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  currentEpoch: 0,
  intervalBlocks: 100,
  minBetAmount: '1000000000000000',
  rounds: {},
}

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
    initialize: (state, action: PayloadAction<PredictionsState>) => {
      return action.payload
    },
    setRound: (state, action: PayloadAction<{ id: string; round: Round }>) => {
      const { id, round } = action.payload
      state.rounds[id] = round
    },
    setRounds: (state, action: PayloadAction<RoundData>) => {
      const rounds = Object.values(action.payload)

      state.currentEpoch = maxBy(rounds, 'epoch').epoch
      state.rounds = action.payload
    },
  },
})

// Actions
export const { setChartPaneState, setHistoryPaneState, setRound, setRounds, initialize } = predictionsSlice.actions

export default predictionsSlice.reducer
