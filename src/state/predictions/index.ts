import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import maxBy from 'lodash/maxBy'
import merge from 'lodash/merge'
import range from 'lodash/range'
import pickBy from 'lodash/pickBy'
import {
  Bet,
  LedgerData,
  HistoryFilter,
  PredictionsState,
  PredictionStatus,
  ReduxNodeRound,
  BetPosition,
  PredictionUser,
  LeaderboardFilter,
  PredictionsChartView,
  PredictionConfig,
} from 'state/types'
import { FetchStatus } from 'config/constants/types'
import {
  FUTURE_ROUND_COUNT,
  LEADERBOARD_MIN_ROUNDS_PLAYED,
  PAST_ROUND_COUNT,
  ROUNDS_PER_PAGE,
  ROUND_BUFFER,
} from './config'
import {
  getBetHistory,
  transformBetResponse,
  makeFutureRoundResponse,
  makeRoundData,
  getRoundsData,
  getPredictionData,
  getLedgerData,
  makeLedgerData,
  serializePredictionsRoundsResponse,
  getClaimStatuses,
  fetchUsersRoundsLength,
  fetchUserRounds,
  getPredictionUsers,
  transformUserResponse,
  LEADERBOARD_RESULTS_PER_PAGE,
  getPredictionUser,
  getHasRoundFailed,
} from './helpers'
import { resetUserState } from '../global/actions'

export const initialState: PredictionsState = {
  status: PredictionStatus.INITIAL,
  chartView: PredictionsChartView.Chainlink,
  isLoading: false,
  isHistoryPaneOpen: false,
  isChartPaneOpen: false,
  isFetchingHistory: false,
  historyFilter: HistoryFilter.ALL,
  currentEpoch: 0,
  intervalSeconds: 300,
  minBetAmount: '10000000000000',
  bufferSeconds: 60,
  rounds: {},
  history: [],
  totalHistory: 0,
  currentHistoryPage: 1,
  hasHistoryLoaded: false,
  ledgers: {},
  claimableStatuses: {},
  leaderboard: {
    selectedAddress: null,
    loadingState: FetchStatus.Idle,
    filters: {
      address: null,
      orderBy: 'netBNB',
      timePeriod: 'all',
    },
    skip: 0,
    hasMoreResults: true,
    addressResults: {},
    results: [],
  },
}

// Thunks
type PredictionInitialization = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalSeconds' | 'minBetAmount' | 'rounds' | 'ledgers' | 'claimableStatuses'
>
export const initializePredictions = createAsyncThunk<PredictionInitialization, string, { extra: PredictionConfig }>(
  'predictions/initialize',
  async (account = null, { extra }) => {
    // Static values
    const marketData = await getPredictionData(extra.address)
    const epochs =
      marketData.currentEpoch > PAST_ROUND_COUNT
        ? range(marketData.currentEpoch, marketData.currentEpoch - PAST_ROUND_COUNT)
        : [marketData.currentEpoch]

    // Round data
    const roundsResponse = await getRoundsData(epochs, extra.address)
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
    const ledgerResponses = await getLedgerData(account, epochs, extra.address)

    // Claim statuses
    const claimableStatuses = await getClaimStatuses(account, epochs, extra.address)

    return merge({}, initializedData, {
      ledgers: makeLedgerData(account, ledgerResponses, epochs),
      claimableStatuses,
    })
  },
)

export const fetchPredictionData = createAsyncThunk<PredictionInitialization, string, { extra: PredictionConfig }>(
  'predictions/fetchPredictionData',
  async (account = null, { extra }) => {
    const { status, currentEpoch, intervalSeconds, minBetAmount } = await getPredictionData(extra.address)
    const liveCurrentAndRecent = [currentEpoch, currentEpoch - 1, currentEpoch - 2]

    const roundsResponse = await getRoundsData(liveCurrentAndRecent, extra.address)
    const roundData = roundsResponse.reduce((accum, round) => {
      if (!round) {
        return accum
      }

      const reduxNodeRound = serializePredictionsRoundsResponse(round)

      return {
        ...accum,
        [reduxNodeRound.epoch.toString()]: reduxNodeRound,
      }
    }, {})

    const publicData = {
      status,
      currentEpoch,
      intervalSeconds,
      minBetAmount,
      rounds: roundData,
      ledgers: {},
      claimableStatuses: {},
    }

    if (!account) {
      return publicData
    }

    const epochs =
      currentEpoch > PAST_ROUND_COUNT ? range(currentEpoch, currentEpoch - PAST_ROUND_COUNT) : [currentEpoch]

    // Bet data
    const ledgerResponses = await getLedgerData(account, epochs, extra.address)

    // Claim statuses
    const claimableStatuses = await getClaimStatuses(account, epochs, extra.address)

    return merge({}, publicData, {
      ledgers: makeLedgerData(account, ledgerResponses, epochs),
      claimableStatuses,
    })
  },
)

export const fetchLedgerData = createAsyncThunk<
  LedgerData,
  { account: string; epochs: number[] },
  { extra: PredictionConfig }
>('predictions/fetchLedgerData', async ({ account, epochs }, { extra }) => {
  const ledgers = await getLedgerData(account, epochs, extra.address)
  return makeLedgerData(account, ledgers, epochs)
})

export const fetchHistory = createAsyncThunk<
  { account: string; bets: Bet[] },
  { account: string; claimed?: boolean },
  { extra: PredictionConfig }
>('predictions/fetchHistory', async ({ account, claimed }, { extra }) => {
  const response = await getBetHistory(
    {
      user: account.toLowerCase(),
      claimed,
    },
    undefined,
    undefined,
    extra.api,
  )
  const bets = response.map(transformBetResponse)

  return { account, bets }
})

export const fetchNodeHistory = createAsyncThunk<
  { bets: Bet[]; claimableStatuses: PredictionsState['claimableStatuses']; page?: number; totalHistory: number },
  { account: string; page?: number },
  { state: PredictionsState; extra: PredictionConfig }
>('predictions/fetchNodeHistory', async ({ account, page = 1 }, { getState, extra }) => {
  const userRoundsLength = await fetchUsersRoundsLength(account, extra.address)
  const emptyResult = { bets: [], claimableStatuses: {}, totalHistory: userRoundsLength.toNumber() }
  const maxPages = userRoundsLength.lte(ROUNDS_PER_PAGE) ? 1 : Math.ceil(userRoundsLength.toNumber() / ROUNDS_PER_PAGE)

  if (userRoundsLength.eq(0)) {
    return emptyResult
  }

  if (page > maxPages) {
    return emptyResult
  }

  const cursor = userRoundsLength.sub(ROUNDS_PER_PAGE * page)

  // If the page request is the final one we only want to retrieve the amount of rounds up to the next cursor.
  const size =
    maxPages === page
      ? userRoundsLength
          .sub(ROUNDS_PER_PAGE * (page - 1)) // Previous page's cursor
          .toNumber()
      : ROUNDS_PER_PAGE
  const userRounds = await fetchUserRounds(account, cursor.lt(0) ? 0 : cursor.toNumber(), size, extra.address)

  if (!userRounds) {
    return emptyResult
  }

  const epochs = Object.keys(userRounds).map((epochStr) => Number(epochStr))
  const roundData = await getRoundsData(epochs, extra.address)
  const claimableStatuses = await getClaimStatuses(account, epochs, extra.address)
  // No need getState().predictions in local redux state
  const { bufferSeconds } = getState()

  // Turn the data from the node into a Bet object that comes from the graph
  const bets: Bet[] = roundData.reduce((accum, round) => {
    const reduxRound = serializePredictionsRoundsResponse(round)
    const ledger = userRounds[reduxRound.epoch]
    const ledgerAmount = BigNumber.from(ledger.amount)
    const closePrice = round.closePrice ? parseFloat(formatUnits(round.closePrice, 8)) : null
    const lockPrice = round.lockPrice ? parseFloat(formatUnits(round.lockPrice, 8)) : null

    const getRoundPosition = () => {
      if (!closePrice) {
        return null
      }

      if (round.closePrice.eq(round.lockPrice)) {
        return BetPosition.HOUSE
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
          failed: getHasRoundFailed(reduxRound.oracleCalled, reduxRound.closeTimestamp, bufferSeconds),
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

  return { bets, claimableStatuses, page, totalHistory: userRoundsLength.toNumber() }
})

// Leaderboard
export const filterLeaderboard = createAsyncThunk<
  { results: PredictionUser[] },
  { filters: LeaderboardFilter },
  { extra: PredictionConfig }
>('predictions/filterLeaderboard', async ({ filters }, { extra }) => {
  const usersResponse = await getPredictionUsers(
    {
      skip: 0,
      orderBy: filters.orderBy,
      where: { totalBets_gte: LEADERBOARD_MIN_ROUNDS_PLAYED, [`${filters.orderBy}_gt`]: 0 },
    },
    extra.api,
  )

  return { results: usersResponse.map(transformUserResponse) }
})

export const fetchAddressResult = createAsyncThunk<
  { account: string; data: PredictionUser },
  string,
  { rejectValue: string; extra: PredictionConfig }
>('predictions/fetchAddressResult', async (account, { rejectWithValue, extra }) => {
  const userResponse = await getPredictionUser(account, extra.api)

  if (!userResponse) {
    return rejectWithValue(account)
  }

  return { account, data: transformUserResponse(userResponse) }
})

export const filterNextPageLeaderboard = createAsyncThunk<
  { results: PredictionUser[]; skip: number },
  number,
  { state: PredictionsState; extra: PredictionConfig }
>('predictions/filterNextPageLeaderboard', async (skip, { getState, extra }) => {
  const state = getState()
  const usersResponse = await getPredictionUsers(
    {
      skip,
      orderBy: state.leaderboard.filters.orderBy,
      where: { totalBets_gte: LEADERBOARD_MIN_ROUNDS_PLAYED, [`${state.leaderboard.filters.orderBy}_gt`]: 0 },
    },
    extra.api,
  )

  return { results: usersResponse.map(transformUserResponse), skip }
})

export const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setLeaderboardFilter: (state, action: PayloadAction<Partial<LeaderboardFilter>>) => {
      state.leaderboard.filters = {
        ...state.leaderboard.filters,
        ...action.payload,
      }

      // Anytime we filters change we need to reset back to page 1
      state.leaderboard.skip = 0
      state.leaderboard.hasMoreResults = true
    },
    setHistoryPaneState: (state, action: PayloadAction<boolean>) => {
      state.isHistoryPaneOpen = action.payload
      state.historyFilter = HistoryFilter.ALL
    },
    setChartPaneState: (state, action: PayloadAction<boolean>) => {
      state.isChartPaneOpen = action.payload
    },
    setChartView: (state, action: PayloadAction<PredictionsChartView>) => {
      state.chartView = action.payload
    },
    setHistoryFilter: (state, action: PayloadAction<HistoryFilter>) => {
      state.historyFilter = action.payload
    },
    markAsCollected: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.claimableStatuses = { ...state.claimableStatuses, ...action.payload }
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.leaderboard.selectedAddress = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.claimableStatuses = {}
      state.ledgers = {}
      state.isFetchingHistory = false
      state.history = []
      state.hasHistoryLoaded = false
      state.totalHistory = 0
      state.currentHistoryPage = 1
    })
    // Leaderboard filter
    builder.addCase(filterLeaderboard.pending, (state) => {
      // Only mark as loading if we come from Fetched. This allows initialization.
      if (state.leaderboard.loadingState === FetchStatus.Fetched) {
        state.leaderboard.loadingState = FetchStatus.Fetching
      }
    })
    builder.addCase(filterLeaderboard.fulfilled, (state, action) => {
      const { results } = action.payload

      state.leaderboard.loadingState = FetchStatus.Fetched
      state.leaderboard.results = results

      if (results.length < LEADERBOARD_RESULTS_PER_PAGE) {
        state.leaderboard.hasMoreResults = false
      }

      // Populate address results to reduce calls
      state.leaderboard.addressResults = {
        ...state.leaderboard.addressResults,
        ...results.reduce((accum, result) => {
          return {
            ...accum,
            [result.id]: result,
          }
        }, {}),
      }
    })

    // Leaderboard account result
    builder.addCase(fetchAddressResult.pending, (state) => {
      state.leaderboard.loadingState = FetchStatus.Fetching
    })
    builder.addCase(fetchAddressResult.fulfilled, (state, action) => {
      const { account, data } = action.payload
      state.leaderboard.loadingState = FetchStatus.Fetched
      state.leaderboard.addressResults[account] = data
    })
    builder.addCase(fetchAddressResult.rejected, (state, action) => {
      state.leaderboard.loadingState = FetchStatus.Fetched // TODO: should handle error
      state.leaderboard.addressResults[action.payload] = null
    })

    // Leaderboard next page
    builder.addCase(filterNextPageLeaderboard.pending, (state) => {
      state.leaderboard.loadingState = FetchStatus.Fetching
    })
    builder.addCase(filterNextPageLeaderboard.fulfilled, (state, action) => {
      const { results, skip } = action.payload

      state.leaderboard.loadingState = FetchStatus.Fetched
      state.leaderboard.results = [...state.leaderboard.results, ...results]
      state.leaderboard.skip = skip

      if (results.length < LEADERBOARD_RESULTS_PER_PAGE) {
        state.leaderboard.hasMoreResults = false
      }
    })

    // Ledger (bet) records
    builder.addCase(fetchLedgerData.fulfilled, (state, action) => {
      state.ledgers = merge({}, state.ledgers, action.payload)
    })

    // Get static market data
    builder.addCase(fetchPredictionData.fulfilled, (state, action) => {
      const { status, currentEpoch, intervalSeconds, minBetAmount, rounds, claimableStatuses, ledgers } = action.payload

      const allRoundData = merge({}, state.rounds, rounds)
      let newRounds = pickBy(allRoundData, (value, key) => {
        return Number(key) > state.currentEpoch - PAST_ROUND_COUNT
      })

      // If the round has change add a new future round
      if (state.currentEpoch !== currentEpoch) {
        const newestRound = maxBy(Object.values(state.rounds), 'epoch')
        const futureRound = makeFutureRoundResponse(
          newestRound.epoch + 1,
          newestRound.startTimestamp + intervalSeconds + ROUND_BUFFER,
        )

        newRounds = { ...newRounds, [futureRound.epoch]: futureRound }
      }

      state.status = status
      state.currentEpoch = currentEpoch
      state.intervalSeconds = intervalSeconds
      state.minBetAmount = minBetAmount
      state.claimableStatuses = merge({}, state.claimableStatuses, claimableStatuses)
      state.ledgers = merge({}, state.ledgers, ledgers)
      state.rounds = newRounds
    })

    // Initialize predictions
    builder.addCase(initializePredictions.fulfilled, (state, action) => {
      const { status, currentEpoch, intervalSeconds, rounds, claimableStatuses, ledgers } = action.payload
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
        claimableStatuses,
        ledgers,
        rounds: merge({}, rounds, makeRoundData(futureRounds)),
      }
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
      const { bets, claimableStatuses, page, totalHistory } = action.payload

      state.isFetchingHistory = false
      state.history = page === 1 ? bets : [...state.history, ...bets]
      state.claimableStatuses = { ...state.claimableStatuses, ...claimableStatuses }
      state.hasHistoryLoaded = state.history.length === totalHistory || bets.length === 0
      state.totalHistory = totalHistory
      state.currentHistoryPage = page
    })
  },
})

// Actions
export const {
  setChartPaneState,
  setChartView,
  setHistoryFilter,
  setHistoryPaneState,
  markAsCollected,
  setLeaderboardFilter,
  setSelectedAddress,
} = predictionsSlice.actions

export default predictionsSlice.reducer
