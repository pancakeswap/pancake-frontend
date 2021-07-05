/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import maxBy from 'lodash/maxBy'
import merge from 'lodash/merge'
import range from 'lodash/range'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  Bet,
  BetDatav2,
  HistoryFilter,
  Market,
  NodeRound,
  PredictionsState,
  PredictionStatus,
  ReduxNodeRound,
  Round,
} from 'state/types'
import { getPredictionsContract } from 'utils/contractHelpers'
import {
  makeFutureRoundResponse,
  transformRoundResponse,
  getBetHistory,
  transformBetResponse,
  getBet,
  makeRoundData,
  transformNodeRoundToReduxNodeRound,
  makeFutureRoundResponsev2,
  makeRoundDataV2,
  getRoundsData,
  getPredictionData,
  MarketData,
  getLedgerData,
  makeLedgerData,
} from './helpers'

const PAST_ROUND_COUNT = 5
const FUTURE_ROUND_COUNT = 2

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
  rewardRate: 97,
  lastOraclePrice: BIG_ZERO.toJSON(),
  rounds: {},
  history: {},
  bets: {},
}

// Thunks
// V2 REFACTOR
type PredictionInitialization = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalBlocks' | 'bufferBlocks' | 'minBetAmount' | 'rewardRate' | 'roundsv2' | 'betsv2'
>
export const initializePredictions = createAsyncThunk<PredictionInitialization, string>(
  'predictions/intialize',
  async (account = null) => {
    // Static values
    const marketData = await getPredictionData()
    const epochs = range(marketData.currentEpoch, marketData.currentEpoch - PAST_ROUND_COUNT)

    // Round data
    const roundsResponse = await getRoundsData(epochs)
    const initialRoundData: { [key: string]: ReduxNodeRound } = roundsResponse.reduce((accum, roundResponse) => {
      const reduxNodeRound = transformNodeRoundToReduxNodeRound(roundResponse)

      return {
        ...accum,
        [reduxNodeRound.epoch.toString()]: reduxNodeRound,
      }
    }, {})

    const initializedData = {
      ...marketData,
      roundsv2: initialRoundData,
      betsv2: {},
    }

    if (!account) {
      return initializedData
    }

    // Bet data
    const ledgerResponses = await getLedgerData(account, epochs)

    return merge({}, initializedData, {
      betsv2: makeLedgerData(account, ledgerResponses, epochs),
    })
  },
)

export const fetchRound = createAsyncThunk<ReduxNodeRound, number>('predictions/fetchRound', async (epoch) => {
  const predictionContract = getPredictionsContract()
  const response: NodeRound = await predictionContract.rounds(epoch)
  return transformNodeRoundToReduxNodeRound(response)
})

export const fetchRounds = createAsyncThunk<{ [key: string]: ReduxNodeRound }, number[]>(
  'predictions/fetchRounds',
  async (epochs) => {
    const rounds = await getRoundsData(epochs)

    return rounds.reduce((accum, round) => {
      if (!round) {
        return accum
      }

      const reduxNodeRound = transformNodeRoundToReduxNodeRound(round)

      return {
        ...accum,
        [reduxNodeRound.epoch.toString()]: reduxNodeRound,
      }
    }, {})
  },
)

export const fetchMarketData = createAsyncThunk<MarketData>('predictions/fetchMarketData', async () => {
  const marketData = await getPredictionData()
  return marketData
})

export const fetchLedgerData = createAsyncThunk<BetDatav2, { account: string; epochs: number[] }>(
  'predictions/fetchLedgerData',
  async ({ account, epochs }) => {
    const ledgers = await getLedgerData(account, epochs)
    return makeLedgerData(account, ledgers, epochs)
  },
)
// END V2 REFACTOR

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
    initialize: (state, action: PayloadAction<Partial<PredictionsState>>) => {
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
    markBetAsCollected: (state, action: PayloadAction<{ account: string; roundId: string }>) => {
      const { account, roundId } = action.payload
      const accountBets = state.bets[account]

      if (accountBets && accountBets[roundId]) {
        accountBets[roundId].claimed = true
      }
    },
    markPositionAsEntered: (state, action: PayloadAction<{ account: string; roundId: string; bet: Bet }>) => {
      const { account, roundId, bet } = action.payload

      state.bets = {
        ...state.bets,
        [account]: {
          ...state.bets[account],
          [roundId]: bet,
        },
      }
    },
    setLastOraclePrice: (state, action: PayloadAction<string>) => {
      state.lastOraclePrice = action.payload
    },

    // V2 REFACTOR
    markLedgerClaimStatus: (state, action: PayloadAction<{ account: string; epoch: number; claimed: boolean }>) => {
      const { account, epoch, claimed } = action.payload
      const currentBet = (state.betsv2[account] && state.betsv2[account][epoch]) || {}

      state.betsv2 = merge({}, state.betsv2, {
        [account]: {
          [epoch]: {
            ...currentBet,
            claimed,
          },
        },
      })
    },
    // END V2 REFACTOR
  },
  extraReducers: (builder) => {
    // Ledger (bet) records
    builder.addCase(fetchLedgerData.fulfilled, (state, action) => {
      state.betsv2 = merge({}, state.betsv2, action.payload)
    })

    // Get static market data
    builder.addCase(fetchMarketData.fulfilled, (state, action) => {
      return merge({}, state, action.payload)
    })

    // Initialize predictions
    builder.addCase(initializePredictions.fulfilled, (state, action) => {
      const { status, currentEpoch, bufferBlocks, intervalBlocks, roundsv2, rewardRate, betsv2 } = action.payload
      const currentRoundStartBlockNumber = action.payload.roundsv2[currentEpoch].startBlock
      const futureRounds: ReduxNodeRound[] = []
      const halfInterval = (intervalBlocks + bufferBlocks) / 2

      for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
        futureRounds.push(
          makeFutureRoundResponsev2(currentEpoch + i, (currentRoundStartBlockNumber + halfInterval) * i),
        )
      }

      return {
        ...state,
        status,
        currentEpoch,
        bufferBlocks,
        intervalBlocks,
        rewardRate,
        betsv2,
        roundsv2: merge({}, roundsv2, makeRoundDataV2(futureRounds)),
      }
    })

    // Get single round
    builder.addCase(fetchRound.fulfilled, (state, action) => {
      state.roundsv2 = merge({}, state.rounds, {
        [action.payload.epoch.toString()]: action.payload,
      })
    })

    // Get multiple rounds
    builder.addCase(fetchRounds.fulfilled, (state, action) => {
      state.roundsv2 = merge({}, state.rounds, action.payload)
    })

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

      // Save any fetched bets in the "bets" namespace
      const betData = bets.reduce((accum, bet) => {
        return {
          ...accum,
          [bet.round.id]: bet,
        }
      }, {})

      state.bets = merge({}, state.bets, {
        [account]: betData,
      })
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
  markLedgerClaimStatus,
} = predictionsSlice.actions

export default predictionsSlice.reducer
