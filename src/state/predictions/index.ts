import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import maxBy from 'lodash/maxBy'
import merge from 'lodash/merge'
import range from 'lodash/range'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  Bet,
  LedgerData,
  HistoryFilter,
  PredictionsState,
  PredictionStatus,
  ReduxNodeRound,
  BetPosition,
} from 'state/types'
import { getPredictionsContract } from 'utils/contractHelpers'
import { FUTURE_ROUND_COUNT, PAST_ROUND_COUNT, ROUND_BUFFER } from './config'
import {
  getBetHistory,
  transformBetResponse,
  makeFutureRoundResponse,
  makeRoundData,
  getRoundsData,
  getPredictionData,
  MarketData,
  getLedgerData,
  makeLedgerData,
  serializePredictionsRoundsResponse,
  getClaimStatuses,
  fetchLatestUserRounds,
} from './helpers'

const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  isFetchingHistory: false,
  historyFilter: HistoryFilter.ALL,
  currentEpoch: 0,
  intervalSeconds: 300,
  minBetAmount: '10000000000000',
  bufferSeconds: 60,
  lastOraclePrice: BIG_ZERO.toJSON(),
  rounds: {},
  history: {},
  ledgers: {},
  claimableStatuses: {},
}

// Thunks
type PredictionInitialization = Pick<
  PredictionsState,
  | 'status'
  | 'currentEpoch'
  | 'intervalSeconds'
  | 'minBetAmount'
  | 'rounds'
  | 'ledgers'
  | 'claimableStatuses'
  | 'bufferSeconds'
>
export const initializePredictions = createAsyncThunk<PredictionInitialization, string>(
  'predictions/intialize',
  async (account = null) => {
    // Static values
    const marketData = await getPredictionData()
    const epochs =
      marketData.currentEpoch > PAST_ROUND_COUNT
        ? range(marketData.currentEpoch, marketData.currentEpoch - PAST_ROUND_COUNT)
        : [marketData.currentEpoch]

    // Round data
    const roundsResponse = await getRoundsData(epochs)
    const initialRoundData: { [key: string]: ReduxNodeRound } = roundsResponse.reduce((accum, roundResponse) => {
      const reduxNodeRound = serializePredictionsRoundsResponse(roundResponse)

      return {
        ...accum,
        [reduxNodeRound.epoch.toString()]: reduxNodeRound,
      }
    }, {})

    const initializedData = {
      ...marketData,
      rounds: initialRoundData,
      ledgers: {},
      claimableStatuses: {},
    }

    if (!account) {
      return initializedData
    }

    // Bet data
    const ledgerResponses = await getLedgerData(account, epochs)

    // Claim statuses
    const claimableStatuses = await getClaimStatuses(account, epochs)

    return merge({}, initializedData, {
      ledgers: makeLedgerData(account, ledgerResponses, epochs),
      claimableStatuses,
    })
  },
)

export const fetchRound = createAsyncThunk<ReduxNodeRound, number>('predictions/fetchRound', async (epoch) => {
  const predictionContract = getPredictionsContract()
  const response = await predictionContract.rounds(epoch)
  return serializePredictionsRoundsResponse(response)
})

export const fetchRounds = createAsyncThunk<{ [key: string]: ReduxNodeRound }, number[]>(
  'predictions/fetchRounds',
  async (epochs) => {
    const rounds = await getRoundsData(epochs)
    return rounds.reduce((accum, round) => {
      if (!round) {
        return accum
      }

      const reduxNodeRound = serializePredictionsRoundsResponse(round)

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

export const fetchLedgerData = createAsyncThunk<LedgerData, { account: string; epochs: number[] }>(
  'predictions/fetchLedgerData',
  async ({ account, epochs }) => {
    const ledgers = await getLedgerData(account, epochs)
    return makeLedgerData(account, ledgers, epochs)
  },
)

export const fetchClaimableStatuses = createAsyncThunk<
  PredictionsState['claimableStatuses'],
  { account: string; epochs: number[] }
>('predictions/fetchClaimableStatuses', async ({ account, epochs }) => {
  const ledgers = await getClaimStatuses(account, epochs)
  return ledgers
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

export const fetchNodeHistory = createAsyncThunk<{ account: string; bets: Bet[] }, string>(
  'predictions/fetchNodeHistory',
  async (account) => {
    const userRounds = await fetchLatestUserRounds(account)

    if (!userRounds) {
      return { account, bets: [] }
    }

    const epochs = Object.keys(userRounds).map((epochStr) => Number(epochStr))
    const roundData = await getRoundsData(epochs)

    // Turn the data from the node into an Bet object that comes from the graph
    const bets: Bet[] = roundData.reduce((accum, round) => {
      const reduxRound = serializePredictionsRoundsResponse(round)
      const ledger = userRounds[reduxRound.epoch]
      const ledgerAmount = ethers.BigNumber.from(ledger.amount)
      const closePrice = round.closePrice ? parseFloat(formatUnits(round.closePrice, 8)) : null
      const lockPrice = round.lockPrice ? parseFloat(formatUnits(round.lockPrice, 8)) : null

      const getRoundPosition = () => {
        if (!closePrice) {
          return null
        }

        return round.closePrice.gt(round.lockPrice) ? BetPosition.BULL : BetPosition.BEAR
      }

      return [
        ...accum,
        {
          id: null,
          hash: null,
          amount: parseFloat(formatUnits(ledgerAmount)),
          position: ledger.position,
          claimed: ledger.claimed,
          claimedAt: null,
          claimedHash: null,
          claimedBNB: 0,
          claimedNetBNB: 0,
          createdAt: null,
          updatedAt: null,
          block: 0,
          round: {
            id: null,
            epoch: round.epoch.toNumber(),
            failed: false,
            startBlock: null,
            startAt: round.startTimestamp ? round.startTimestamp.toNumber() : null,
            startHash: null,
            lockAt: round.lockTimestamp ? round.lockTimestamp.toNumber() : null,
            lockBlock: null,
            lockPrice,
            lockHash: null,
            lockRoundId: round.lockOracleId ? round.lockOracleId.toString() : null,
            closeRoundId: round.closeOracleId ? round.closeOracleId.toString() : null,
            closeHash: null,
            closeAt: null,
            closePrice,
            closeBlock: null,
            totalBets: 0,
            totalAmount: parseFloat(formatUnits(round.totalAmount)),
            bullBets: 0,
            bullAmount: parseFloat(formatUnits(round.bullAmount)),
            bearBets: 0,
            bearAmount: parseFloat(formatUnits(round.bearAmount)),
            position: getRoundPosition(),
          },
        },
      ]
    }, [])

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
    setCurrentEpoch: (state, action: PayloadAction<number>) => {
      state.currentEpoch = action.payload
    },
    setLastOraclePrice: (state, action: PayloadAction<string>) => {
      state.lastOraclePrice = action.payload
    },
    markBetHistoryAsCollected: (state, action: PayloadAction<{ account: string; betId: string }>) => {
      const { account, betId } = action.payload

      if (state.history[account]) {
        const betIndex = state.history[account].findIndex((bet) => bet.id === betId)

        if (betIndex >= 0) {
          state.history[account][betIndex].claimed = true
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Claimable statuses
    builder.addCase(fetchClaimableStatuses.fulfilled, (state, action) => {
      state.claimableStatuses = merge({}, state.claimableStatuses, action.payload)
    })

    // Ledger (bet) records
    builder.addCase(fetchLedgerData.fulfilled, (state, action) => {
      state.ledgers = merge({}, state.ledgers, action.payload)
    })

    // Get static market data
    builder.addCase(fetchMarketData.fulfilled, (state, action) => {
      const { status, currentEpoch, intervalSeconds, minBetAmount } = action.payload

      // If the round has change add a new future round
      if (state.currentEpoch !== currentEpoch) {
        const newestRound = maxBy(Object.values(state.rounds), 'epoch')
        const futureRound = makeFutureRoundResponse(
          newestRound.epoch + 1,
          newestRound.startTimestamp + intervalSeconds + ROUND_BUFFER,
        )

        state.rounds[futureRound.epoch] = futureRound
      }

      state.status = status
      state.currentEpoch = currentEpoch
      state.intervalSeconds = intervalSeconds
      state.minBetAmount = minBetAmount
    })

    // Initialize predictions
    builder.addCase(initializePredictions.fulfilled, (state, action) => {
      const { status, currentEpoch, intervalSeconds, bufferSeconds, rounds, claimableStatuses, ledgers } =
        action.payload
      const futureRounds: ReduxNodeRound[] = []
      const currentRound = rounds[currentEpoch]

      for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
        futureRounds.push(makeFutureRoundResponse(currentEpoch + i, currentRound.startTimestamp + intervalSeconds * i))
      }

      return {
        ...state,
        status,
        currentEpoch,
        intervalSeconds,
        bufferSeconds,
        claimableStatuses,
        ledgers,
        rounds: merge({}, rounds, makeRoundData(futureRounds)),
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
      state.rounds = merge({}, state.rounds, action.payload)
    })

    // Show History
    builder.addCase(fetchHistory.pending, (state) => {
      state.isFetchingHistory = true
    })
    builder.addCase(fetchHistory.rejected, (state) => {
      state.isFetchingHistory = false
    })
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      const { account, bets } = action.payload

      state.isFetchingHistory = false
      state.history[account] = merge([], state.history[account] ?? [], bets)
    })

    // History from the node
    builder.addCase(fetchNodeHistory.pending, (state) => {
      state.isFetchingHistory = true
    })
    builder.addCase(fetchNodeHistory.rejected, (state) => {
      state.isFetchingHistory = false
    })
    builder.addCase(fetchNodeHistory.fulfilled, (state, action) => {
      const { account, bets } = action.payload
      state.history[account] = merge([], state.history[account] ?? [], bets)
    })
  },
})

// Actions
export const {
  setChartPaneState,
  setCurrentEpoch,
  setHistoryFilter,
  setHistoryPaneState,
  setPredictionStatus,
  setLastOraclePrice,
  markBetHistoryAsCollected,
} = predictionsSlice.actions

export default predictionsSlice.reducer
