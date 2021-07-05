/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import maxBy from 'lodash/maxBy'
import merge from 'lodash/merge'
import range from 'lodash/range'
import predictionsAbi from 'config/abi/predictions.json'
import { BIG_ZERO } from 'utils/bigNumber'
import { getPredictionsAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import {
  Bet,
  HistoryFilter,
  Market,
  NodeLedgerResponse,
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
  transformNodeLedgerResponseToReduxLedger,
  makeFutureRoundResponsev2,
  makeRoundDataV2,
  getRoundsData,
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
type PredictionInitialization = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalBlocks' | 'bufferBlocks' | 'minBetAmount' | 'rewardRate' | 'roundsv2' | 'betsv2'
>
export const initializePredictions = createAsyncThunk<PredictionInitialization, string>(
  'predictions/intialize',
  async (account = null) => {
    const address = getPredictionsAddress()

    // Static values
    const staticCalls = ['currentEpoch', 'intervalBlocks', 'minBetAmount', 'paused', 'bufferBlocks', 'rewardRate'].map(
      (method) => ({
        address,
        name: method,
      }),
    )
    const [[currentEpoch], [intervalBlocks], [minBetAmount], [paused], [bufferBlocks], [rewardRate]] =
      await multicallv2(predictionsAbi, staticCalls)
    const epochs = range(currentEpoch, currentEpoch.sub(PAST_ROUND_COUNT).toNumber())

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
      status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
      currentEpoch: currentEpoch.toNumber(),
      intervalBlocks: intervalBlocks.toNumber(),
      bufferBlocks: bufferBlocks.toNumber(),
      minBetAmount: minBetAmount.toString(),
      rewardRate: rewardRate.toNumber(),
      roundsv2: initialRoundData,
      betsv2: {},
    }

    if (!account) {
      return initializedData
    }

    // Bet data
    const ledgerCalls = epochs.map((roundEpoch) => ({
      address,
      name: 'ledger',
      params: [roundEpoch, account],
    }))
    const ledgerResponses = (await multicallv2(predictionsAbi, ledgerCalls)) as NodeLedgerResponse[]

    return merge({}, initializedData, {
      betsv2: ledgerResponses.reduce((accum, ledgerResponse, index) => {
        if (!ledgerResponse) {
          return accum
        }

        // If the amount is zero that means the user did not bet
        if (ledgerResponse.amount.eq(0)) {
          return accum
        }

        const epoch = epochs[index].toString()

        return {
          ...accum,
          [account]: {
            ...accum[account],
            [epoch]: transformNodeLedgerResponseToReduxLedger(ledgerResponse),
          },
        }
      }, {}),
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

/**
 * Used to poll the user bets of the current round cards
 */
export const fetchCurrentBets = createAsyncThunk<
  { account: string; bets: Bet[] },
  { account: string; roundIds: string[] }
>('predictions/fetchCurrentBets', async ({ account, roundIds }) => {
  const betResponses = await getBetHistory({
    user: account.toLowerCase(),
    round_in: roundIds,
  })

  return { account, bets: betResponses.map(transformBetResponse) }
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
  },
  extraReducers: (builder) => {
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
      state.rounds = merge({}, state.rounds, {
        [action.payload.epoch.toString()]: action.payload,
      })
    })

    // Get multiple rounds
    builder.addCase(fetchRounds.fulfilled, (state, action) => {
      state.roundsv2 = merge({}, state.rounds, action.payload)
    })

    // Get unclaimed bets
    builder.addCase(fetchCurrentBets.fulfilled, (state, action) => {
      const { account, bets } = action.payload
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
} = predictionsSlice.actions

export default predictionsSlice.reducer
