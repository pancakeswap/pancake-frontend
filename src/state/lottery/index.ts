/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotteryTicket, LotteryStatus } from 'config/constants/types'
import { LotteryState, LotteryRound, PastLotteryRound, UserLotteryHistory } from 'state/types'
import { getPastLotteries, getUserPastLotteries, fetchLottery, fetchPublicData, fetchTickets } from './helpers'

interface PublicLotteryData {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
}

const initialState: LotteryState = {
  currentLotteryId: null,
  maxNumberTicketsPerBuyOrClaim: null,
  currentRound: {
    isLoading: true,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInCake: '',
    discountDivisor: '',
    treasuryFee: '',
    firstTicketId: '',
    lastTicketId: '',
    amountCollectedInCake: '',
    finalNumber: '',
    cakePerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
    userData: {
      isLoading: true,
      tickets: [],
    },
  },
  pastLotteries: null,
  userLotteryHistory: null,
}

export const fetchCurrentLottery = createAsyncThunk<LotteryRound, { currentLotteryId: string }>(
  'lottery/fetchById',
  async ({ currentLotteryId }) => {
    const lotteryInfo = await fetchLottery(currentLotteryId)
    return lotteryInfo
  },
)

export const fetchPublicLotteryData = createAsyncThunk<PublicLotteryData>('lottery/fetchPublicData', async () => {
  const publicData = await fetchPublicData()
  return publicData
})

export const fetchUserTickets = createAsyncThunk<LotteryTicket[], { account: string; lotteryId: string }>(
  'lottery/fetchUserTickets',
  async ({ account, lotteryId }) => {
    const cursor = 0
    const userTickets = await fetchTickets(account, lotteryId, cursor)
    return userTickets
  },
)

export const fetchPastLotteries = createAsyncThunk<PastLotteryRound[]>('lottery/fetchPastLotteries', async () => {
  const lotteries = await getPastLotteries()
  return lotteries
})

export const fetchUserLotteryHistory = createAsyncThunk<UserLotteryHistory, { account: string }>(
  'lottery/fetchUserLotteryHistory',
  async ({ account }) => {
    const userPastLotteries = await getUserPastLotteries(account)
    return userPastLotteries
  },
)

export const LotterySlice = createSlice({
  name: 'Lottery',
  initialState,
  reducers: {
    setLotteryPublicData: (state, action) => {
      state = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentLottery.fulfilled, (state, action: PayloadAction<LotteryRound>) => {
      state.currentRound = { ...state.currentRound, ...action.payload }
    })
    builder.addCase(fetchPublicLotteryData.fulfilled, (state, action: PayloadAction<PublicLotteryData>) => {
      state.currentLotteryId = action.payload.currentLotteryId
      state.maxNumberTicketsPerBuyOrClaim = action.payload.maxNumberTicketsPerBuyOrClaim
    })
    builder.addCase(fetchUserTickets.fulfilled, (state, action: PayloadAction<any>) => {
      state.currentRound.userData.isLoading = false
      state.currentRound.userData.tickets = action.payload
    })
    builder.addCase(fetchPastLotteries.fulfilled, (state, action: PayloadAction<PastLotteryRound[]>) => {
      state.pastLotteries = action.payload
    })
    builder.addCase(fetchUserLotteryHistory.fulfilled, (state, action: PayloadAction<UserLotteryHistory>) => {
      state.userLotteryHistory = action.payload
    })
  },
})

// Actions
export const { setLotteryPublicData } = LotterySlice.actions

export default LotterySlice.reducer
