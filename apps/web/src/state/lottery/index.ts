/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { LotteryResponse, LotteryRoundGraphEntity, LotteryState, LotteryUserGraphEntity } from 'state/types'
import { resetUserState } from '../global/actions'
import getLotteriesData from './getLotteriesData'
import getUserLotteryData, { getGraphLotteryUser } from './getUserLotteryData'
import { fetchCurrentLotteryIdAndMaxBuy, fetchLottery } from './helpers'

interface PublicLotteryData {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
}

const initialState: LotteryState = {
  currentLotteryId: '',
  isTransitioning: false,
  maxNumberTicketsPerBuyOrClaim: '',
  currentRound: {
    isLoading: true,
    lotteryId: '',
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInCake: '',
    discountDivisor: '',
    treasuryFee: '',
    firstTicketId: '',
    amountCollectedInCake: '',
    finalNumber: 0,
    cakePerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
    userTickets: {
      isLoading: true,
      tickets: [],
    },
  },
  lotteriesData: [],
  userLotteryData: { account: '', totalCake: '', totalTickets: '', rounds: [] },
}

export const fetchCurrentLottery = createAsyncThunk<LotteryResponse, { currentLotteryId: string }>(
  'lottery/fetchCurrentLottery',
  async ({ currentLotteryId }) => {
    const lotteryInfo = await fetchLottery(currentLotteryId)
    return lotteryInfo
  },
)

export const fetchCurrentLotteryId = createAsyncThunk<PublicLotteryData>('lottery/fetchCurrentLotteryId', async () => {
  const currentIdAndMaxBuy = await fetchCurrentLotteryIdAndMaxBuy()
  return currentIdAndMaxBuy
})

export const fetchUserTicketsAndLotteries = createAsyncThunk<
  { userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity },
  { account: string; currentLotteryId: string }
>('lottery/fetchUserTicketsAndLotteries', async ({ account, currentLotteryId }) => {
  const userLotteriesRes = await getUserLotteryData(account, currentLotteryId)
  const userParticipationInCurrentRound = userLotteriesRes.rounds?.find((round) => round.lotteryId === currentLotteryId)
  const userTickets = userParticipationInCurrentRound?.tickets

  // User has not bought tickets for the current lottery, or there has been an error
  if (!userTickets || userTickets.length === 0) {
    return { userTickets: [], userLotteries: userLotteriesRes }
  }

  return { userTickets, userLotteries: userLotteriesRes }
})

export const fetchPublicLotteries = createAsyncThunk<LotteryRoundGraphEntity[], { currentLotteryId: string }>(
  'lottery/fetchPublicLotteries',
  async ({ currentLotteryId }) => {
    const lotteries = await getLotteriesData(currentLotteryId)
    return lotteries
  },
)

export const fetchUserLotteries = createAsyncThunk<
  LotteryUserGraphEntity,
  { account: string; currentLotteryId: string }
>('lottery/fetchUserLotteries', async ({ account, currentLotteryId }) => {
  const userLotteries = await getUserLotteryData(account, currentLotteryId)
  return userLotteries
})

export const fetchAdditionalUserLotteries = createAsyncThunk<
  LotteryUserGraphEntity,
  { account: string; skip?: number }
>('lottery/fetchAdditionalUserLotteries', async ({ account, skip }) => {
  const additionalUserLotteries = await getGraphLotteryUser(account, undefined, skip)
  return additionalUserLotteries
})

export const setLotteryIsTransitioning = createAsyncThunk<{ isTransitioning: boolean }, { isTransitioning: boolean }>(
  `lottery/setIsTransitioning`,
  async ({ isTransitioning }) => {
    return { isTransitioning }
  },
)

export const LotterySlice = createSlice({
  name: 'Lottery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.userLotteryData = { ...initialState.userLotteryData }

      state.currentRound = { ...state.currentRound, userTickets: { ...initialState.currentRound.userTickets } }
    })
    builder.addCase(fetchCurrentLottery.fulfilled, (state, action: PayloadAction<LotteryResponse>) => {
      state.currentRound = { ...state.currentRound, ...action.payload }
    })
    builder.addCase(fetchCurrentLotteryId.fulfilled, (state, action: PayloadAction<PublicLotteryData>) => {
      state.currentLotteryId = action.payload.currentLotteryId
      state.maxNumberTicketsPerBuyOrClaim = action.payload.maxNumberTicketsPerBuyOrClaim
    })
    builder.addCase(
      fetchUserTicketsAndLotteries.fulfilled,
      (state, action: PayloadAction<{ userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity }>) => {
        state.currentRound = {
          ...state.currentRound,
          userTickets: { isLoading: false, tickets: action.payload.userTickets },
        }
        state.userLotteryData = action.payload.userLotteries
      },
    )
    builder.addCase(fetchPublicLotteries.fulfilled, (state, action: PayloadAction<LotteryRoundGraphEntity[]>) => {
      state.lotteriesData = action.payload
    })
    builder.addCase(fetchUserLotteries.fulfilled, (state, action: PayloadAction<LotteryUserGraphEntity>) => {
      state.userLotteryData = action.payload
    })
    builder.addCase(fetchAdditionalUserLotteries.fulfilled, (state, action: PayloadAction<LotteryUserGraphEntity>) => {
      const mergedRounds = [...state.userLotteryData.rounds, ...action.payload.rounds]
      state.userLotteryData = { ...state.userLotteryData, rounds: mergedRounds }
    })
    builder.addCase(
      setLotteryIsTransitioning.fulfilled,
      (state, action: PayloadAction<{ isTransitioning: boolean }>) => {
        state.isTransitioning = action.payload.isTransitioning
      },
    )
  },
})

export default LotterySlice.reducer
