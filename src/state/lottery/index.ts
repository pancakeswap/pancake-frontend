/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { LotteryState, LotteryRound, LotteryStatus, PastLotteryRound, UserLotteryHistory } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getPastLotteries, getUserPastLotteries, fetchLottery, fetchPublicData, fetchTickets } from './helpers'

interface PublicLotteryData {
  currentLotteryId: string
  maxNumberTicketsPerBuy: string
}

const initialState: LotteryState = {
  currentLotteryId: null,
  maxNumberTicketsPerBuy: null,
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

// TODO: Change any type
export const fetchUserTickets = createAsyncThunk<any, { account: string; lotteryId: string }>(
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
      state.maxNumberTicketsPerBuy = action.payload.maxNumberTicketsPerBuy
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
