/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { maxBy } from 'lodash'
import { Bet, HistoryFilter, Market, PredictionsState, PredictionStatus, Round } from 'state/types'
import {
  makeFutureRoundResponse,
  transformRoundResponse,
  getBetHistory,
  transformBetResponse,
  getBet,
  makeRoundData,
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
  lastOraclePrice: new BigNumber(0).toJSON(),
  rounds: {},
  history: {},
  bets: {},
}

// Thunks
export const fetchBet = createAsyncThunk<{ account: string; bet: Bet }, { account: string; id: string }>(
  'predictions/fetchBet',
  async ({ account, id }) => {
    const response = await getBet(id)
    const bet = transformBetResponse(response)
    return { account, bet }
  },
)

export const fetchRoundBet = createAsyncThunk<
  { account: string; roundId: string; bet: Bet },
  { account: string; roundId: string }
>('predictions/fetchRoundBet', async ({ account, roundId }) => {
  const betResponses = await getBetHistory({
    user: account.toLowerCase(),
    round: roundId,
  })

  // This should always return 0 or 1 bet because a user can only place
  // one bet per round
  if (betResponses && betResponses.length === 1) {
    const [betResponse] = betResponses
    return { account, roundId, bet: transformBetResponse(betResponse) }
  }

  return { account, roundId, bet: null }
})

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
      return {
        ...state,
        ...action.payload,
      }
    },
    updateMarketData: (state, action: PayloadAction<{ rounds: Round[]; market: Market }>) => {
      const { rounds, market } = action.payload
      const newRoundData = makeRoundData(rounds)
      const incomingCurrentRound = maxBy(rounds, 'epoch')

      if (state.currentEpoch !== incomingCurrentRound.epoch) {
        // Add new round
        const newestRound = maxBy(rounds, 'epoch') as Round
        const futureRound = transformRoundResponse(
          makeFutureRoundResponse(newestRound.epoch + 2, newestRound.startBlock + state.intervalBlocks),
        )

        newRoundData[futureRound.id] = futureRound
      }

      state.currentEpoch = incomingCurrentRound.epoch
      state.currentRoundStartBlockNumber = incomingCurrentRound.startBlock
      state.status = market.paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE
      state.rounds = { ...state.rounds, ...newRoundData }
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
    markPositionAsEntered: (
      state,
      action: PayloadAction<{ account: string; roundId: string; partialBet: Partial<Bet> }>,
    ) => {
      const { account, roundId, partialBet } = action.payload

      state.bets = {
        ...state.bets,
        [account]: {
          ...state.bets[account],
          [roundId]: partialBet,
        },
      }
    },
    setLastOraclePrice: (state, action: PayloadAction<string>) => {
      state.lastOraclePrice = action.payload
    },
  },
  extraReducers: (builder) => {
    // Get round bet
    builder.addCase(fetchRoundBet.fulfilled, (state, action) => {
      const { account, roundId, bet } = action.payload

      if (bet) {
        state.bets = {
          ...state.bets,
          [account]: {
            ...state.bets[account],
            [roundId]: bet,
          },
        }
      }
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
  updateMarketData,
  markBetAsCollected,
  setPredictionStatus,
  markPositionAsEntered,
  setLastOraclePrice,
} = predictionsSlice.actions

export default predictionsSlice.reducer
