import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { formatUnits } from 'viem'
import merge from 'lodash/merge'
import range from 'lodash/range'
import pickBy from 'lodash/pickBy'
import {
  Bet,
  LedgerData,
  HistoryFilter,
  PredictionsState,
  PredictionStatus,
  BetPosition,
  PredictionUser,
  LeaderboardFilter,
  PredictionsChartView,
  PredictionConfig,
  ReduxNodeRound,
} from 'state/types'
import { Address } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import { FUTURE_ROUND_COUNT, LEADERBOARD_MIN_ROUNDS_PLAYED, PAST_ROUND_COUNT, ROUNDS_PER_PAGE } from './config'
import {
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
      orderBy: 'totalBets',
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
export const fetchPredictionData = createAsyncThunk<PredictionInitialization, Address, { extra: PredictionConfig }>(
  'predictions/fetchPredictionData',
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
        [roundResponse.epoch.toString()]: reduxNodeRound,
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

    const [ledgerResponses, claimableStatuses] = await Promise.all([
      getLedgerData(account, epochs, extra.address), // Bet data
      getClaimStatuses(account, epochs, extra.address), // Claim statuses
    ])

    return merge({}, initializedData, {
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
  const ledgers = await getLedgerData(account as Address, epochs, extra.address)
  return makeLedgerData(account, ledgers, epochs)
})

export const fetchNodeHistory = createAsyncThunk<
  { bets: Bet[]; claimableStatuses: PredictionsState['claimableStatuses']; page?: number; totalHistory: number },
  { account: Address; page?: number },
  { state: PredictionsState; extra: PredictionConfig }
>('predictions/fetchNodeHistory', async ({ account, page = 1 }, { getState, extra }) => {
  const userRoundsLength = Number(await fetchUsersRoundsLength(account, extra.address))
  const emptyResult = { bets: [], claimableStatuses: {}, totalHistory: userRoundsLength }
  const maxPages = userRoundsLength <= ROUNDS_PER_PAGE ? 1 : Math.ceil(userRoundsLength / ROUNDS_PER_PAGE)

  if (userRoundsLength === 0) {
    return emptyResult
  }

  if (page > maxPages) {
    return emptyResult
  }

  const cursor = userRoundsLength - ROUNDS_PER_PAGE * page

  // If the page request is the final one we only want to retrieve the amount of rounds up to the next cursor.
  const size =
    maxPages === page
      ? userRoundsLength - ROUNDS_PER_PAGE * (page - 1) // Previous page's cursor
      : ROUNDS_PER_PAGE
  const userRounds = await fetchUserRounds(account, cursor < 0 ? 0 : cursor, size, extra.address)

  if (!userRounds) {
    return emptyResult
  }

  const epochs = Object.keys(userRounds).map((epochStr) => Number(epochStr))
  const [roundData, claimableStatuses] = await Promise.all([
    getRoundsData(epochs, extra.address),
    getClaimStatuses(account, epochs, extra.address),
  ])

  // No need getState().predictions in local redux state
  const { bufferSeconds } = getState()

  // Turn the data from the node into a Bet object that comes from the graph
  const bets: Bet[] = roundData.reduce((accum, round) => {
    const ledger = userRounds[Number(round.epoch)]
    const ledgerAmount = BigInt(ledger.amount)
    const closePrice = round.closePrice ? parseFloat(formatUnits(round.closePrice, 8)) : null
    const lockPrice = round.lockPrice ? parseFloat(formatUnits(round.lockPrice, 8)) : null

    const getRoundPosition = () => {
      if (!closePrice) {
        return null
      }

      if (round.closePrice === round.lockPrice) {
        return BetPosition.HOUSE
      }

      return round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR
    }

    return [
      ...accum,
      {
        id: null,
        hash: null,
        amount: parseFloat(formatUnits(ledgerAmount, 18)),
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
          epoch: Number(round.epoch),
          failed: getHasRoundFailed(
            round.oracleCalled,
            round.closeTimestamp === 0n ? null : Number(round.closeTimestamp),
            bufferSeconds,
          ),
          startBlock: null,
          startAt: round.startTimestamp ? Number(round.startTimestamp) : null,
          startHash: null,
          lockAt: round.lockTimestamp ? Number(round.lockTimestamp) : null,
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
          totalAmount: parseFloat(formatUnits(round.totalAmount, 18)),
          bullBets: 0,
          bullAmount: parseFloat(formatUnits(round.bullAmount, 18)),
          bearBets: 0,
          bearAmount: parseFloat(formatUnits(round.bearAmount, 18)),
          position: getRoundPosition(),
        },
      },
    ]
  }, [])

  return { bets, claimableStatuses, page, totalHistory: Number(userRoundsLength) }
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
    extra.token.symbol,
  )

  const transformer = transformUserResponse(extra.token.symbol)

  return { results: usersResponse.map(transformer) }
})

export const fetchAddressResult = createAsyncThunk<
  { account: string; data: PredictionUser },
  string,
  { rejectValue: string; extra: PredictionConfig }
>('predictions/fetchAddressResult', async (account, { rejectWithValue, extra }) => {
  const userResponse = await getPredictionUser(account, extra.api, extra.token.symbol)

  if (!userResponse) {
    return rejectWithValue(account)
  }

  return { account, data: transformUserResponse(extra.token.symbol)(userResponse) }
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
    extra.token.symbol,
  )

  const transformer = transformUserResponse(extra.token.symbol)

  return { results: usersResponse.map(transformer), skip }
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

      const futureRounds: ReduxNodeRound[] = []
      const currentRound = rounds[currentEpoch]
      for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
        futureRounds.push(
          makeFutureRoundResponse(currentEpoch + i, Number(currentRound.startTimestamp) + intervalSeconds * i),
        )
      }

      newRounds = { ...newRounds, ...makeRoundData(futureRounds) }

      state.status = status
      state.currentEpoch = currentEpoch
      state.intervalSeconds = intervalSeconds
      state.minBetAmount = minBetAmount
      state.claimableStatuses = merge({}, state.claimableStatuses, claimableStatuses)
      state.ledgers = merge({}, state.ledgers, ledgers)
      state.rounds = newRounds
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
