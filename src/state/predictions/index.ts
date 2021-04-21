/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { maxBy } from 'lodash'
import { Bet, HistoryFilter, PredictionsState, PredictionStatus, Round, RoundData } from 'state/types'
import {
  getRound,
  makeFutureRoundResponse,
  transformRoundResponse,
  getBetHistory,
  transformBetResponse,
  getBet,
} from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  isFetchingHistory: false,
  historyFilter: HistoryFilter.ALL,
  currentEpoch: 0,
  currentRoundStartBlockNumber: 0,
  intervalBlocks: 100,
  bufferBlocks: 2,
  minBetAmount: '1000000000000000',
  rounds: {},
  history: {},
}

// Thunks
export const updateRound = createAsyncThunk<Round, { id: string }>('predictions/updateRound', async ({ id }) => {
  const response = await getRound(id)
  const round = transformRoundResponse(response)

  return round
})

export const fetchBet = createAsyncThunk<{ account: string; bet: Bet }, { account: string; id: string }>(
  'predictions/fetchBet',
  async ({ account, id }) => {
    const response = await getBet(id)
    const bet = transformBetResponse(response)
    return { account, bet }
  },
)

export const fetchHistory = createAsyncThunk<{ account: string; bets: Bet[] }, { account: string; claimed?: boolean }>(
  'predictions/fetchHistory',
  async ({ account, claimed }) => {
    const response = await getBetHistory({
      user: account.toLowerCase(),
      claimed,
    })
    const bets = response.map(transformBetResponse)

    return { account, bets }
  },
)

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setPredictionStatus: (state, action: PayloadAction<PredictionStatus>) => {
      state.status = action.payload
    },
    setHistoryPaneState: (state, action: PayloadAction<boolean>) => {
      state.isHistoryPaneOpen = action.payload
      state.historyFilter = HistoryFilter.ALL
    },
    setChartPaneState: (state, action: PayloadAction<boolean>) => {
      state.isChartPaneOpen = action.payload
    },
    setHistoryFilter: (state, action: PayloadAction<HistoryFilter>) => {
      state.historyFilter = action.payload
    },
    initialize: (state, action: PayloadAction<PredictionsState>) => {
      return action.payload
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
    markBetAsCollected: (state, action: PayloadAction<{ account: string; betId: string }>) => {
      const { account, betId } = action.payload
      const history = state.history[account]

      if (history) {
        const betIndex = history.findIndex((bet) => bet.id === betId)

        if (betIndex >= 0) {
          history[betIndex].claimed = true
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Update Round
    builder.addCase(updateRound.fulfilled, (state, action) => {
      const { payload: round } = action
      state.rounds[round.id] = round
    })

    // Update Bet
    builder.addCase(fetchBet.fulfilled, (state, action) => {
      const { account, bet } = action.payload
      state.history[account] = [...state.history[account].filter((currentBet) => currentBet.id !== bet.id), bet]
    })

    // Show History
    builder.addCase(fetchHistory.pending, (state) => {
      state.isFetchingHistory = true
    })
    builder.addCase(fetchHistory.rejected, (state) => {
      state.isFetchingHistory = false
      state.isHistoryPaneOpen = true
    })
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      const { account, bets } = action.payload

      state.isFetchingHistory = false
      state.isHistoryPaneOpen = true
      state.history[account] = bets
    })
  },
})

// Actions
export const {
  initialize,
  setChartPaneState,
  setCurrentEpoch,
  setHistoryFilter,
  setHistoryPaneState,
  updateRounds,
  markBetAsCollected,
  setPredictionStatus,
} = predictionsSlice.actions

export default predictionsSlice.reducer
