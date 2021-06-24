/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotteryTicket, LotteryStatus } from 'config/constants/types'
import { LotteryState, LotteryRound, PastLotteryRound, UserLotteryData } from 'state/types'
import { getPastLotteries, getUserLotteries, fetchLottery, fetchPublicData, fetchTickets } from './helpers'

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
  userLotteryData: null,
}

export const fetchCurrentLottery = createAsyncThunk<LotteryRound, { currentLotteryId: string }>(
  'lottery/fetchCurrentLottery',
  async ({ currentLotteryId }) => {
    const lotteryInfo = await fetchLottery(currentLotteryId)
    return lotteryInfo
  },
)

export const fetchPublicLotteryData = createAsyncThunk<PublicLotteryData>('lottery/fetchPublicData', async () => {
  const publicData = await fetchPublicData()
  return publicData
})

export const fetchUserTicketsAndLotteries = createAsyncThunk<
  { userTickets: LotteryTicket[]; userLotteries: UserLotteryData },
  { account: string; lotteryId: string }
>('lottery/fetchUserTicketsAndLotteries', async ({ account, lotteryId }) => {
  const userLotteries = await getUserLotteries(account)
  const userTickets = await fetchTickets(account, lotteryId, userLotteries)
  return { userTickets, userLotteries }
})

export const fetchPastLotteries = createAsyncThunk<PastLotteryRound[]>('lottery/fetchPastLotteries', async () => {
  const lotteries = await getPastLotteries()
  return lotteries
})

export const fetchUserLotteries = createAsyncThunk<UserLotteryData, { account: string }>(
  'lottery/fetchUserLotteries',
  async ({ account }) => {
    const userLotteries = await getUserLotteries(account)
    return userLotteries
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
    builder.addCase(
      fetchUserTicketsAndLotteries.fulfilled,
      (state, action: PayloadAction<{ userTickets: LotteryTicket[]; userLotteries: UserLotteryData }>) => {
        state.currentRound.userData.isLoading = false
        state.currentRound.userData.tickets = action.payload.userTickets
        state.userLotteryData = action.payload.userLotteries
      },
    )
    builder.addCase(fetchPastLotteries.fulfilled, (state, action: PayloadAction<PastLotteryRound[]>) => {
      state.pastLotteries = action.payload
    })
    builder.addCase(fetchUserLotteries.fulfilled, (state, action: PayloadAction<UserLotteryData>) => {
      state.userLotteryData = action.payload
    })
  },
})

// Actions
export const { setLotteryPublicData } = LotterySlice.actions

export default LotterySlice.reducer
