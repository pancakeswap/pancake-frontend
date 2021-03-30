/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { maxBy } from 'lodash'
import { PredictionsState, PredictionStatus, Round, RoundData } from 'state/types'
import { makeFutureRoundResponse, transformRoundResponse } from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  currentEpoch: 0,
  currentRoundStartBlockNumber: 0,
  intervalBlocks: 100,
  bufferBlocks: 2,
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
    updateRounds: (state, action: PayloadAction<RoundData>) => {
      const newRoundData = { ...state.rounds, ...action.payload }
      const incomingRounds = Object.values(action.payload)
      const incomingCurrentRound = maxBy(incomingRounds, 'epoch')

      if (state.currentEpoch !== incomingCurrentRound.epoch) {
        const rounds = Object.values(newRoundData)

        // Add new round
        const newestRound = maxBy(rounds, 'epoch')
        const futureRound = transformRoundResponse(
          makeFutureRoundResponse(newestRound.epoch + 1, newestRound.startBlock + state.intervalBlocks),
        )

        newRoundData[futureRound.id] = futureRound
      }

      state.currentEpoch = incomingCurrentRound.epoch
      state.currentRoundStartBlockNumber = incomingCurrentRound.startBlock
      state.rounds = newRoundData
    },
    setCurrentEpoch: (state, action: PayloadAction<number>) => {
      state.currentEpoch = action.payload
    },
  },
})

// Actions
export const {
  setChartPaneState,
  setHistoryPaneState,
  setRound,
  updateRounds,
  setCurrentEpoch,
  initialize,
} = predictionsSlice.actions

export default predictionsSlice.reducer
