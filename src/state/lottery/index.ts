/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { LotteryState, LotteryRound, LotteryStatus, PastLotteryRound, UserLotteryHistory } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getPastLotteries, getUserPastLotteries } from './helpers'

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

const lotteryContract = getLotteryV2Contract()

// TODO: Move SC fetches into helper
export const fetchLottery = async (lotteryId: string) => {
  try {
    const lotteryData = await lotteryContract.methods.lotteries(lotteryId).call()
    const {
      status,
      startTime,
      endTime,
      priceTicketInCake,
      discountDivisor,
      treasuryFee,
      firstTicketId,
      lastTicketId,
      amountCollectedInCake,
      finalNumber,
    } = lotteryData
    const priceTicketInCakeAsBN = new BigNumber(priceTicketInCake as string)
    const amountCollectedInCakeAsBN = new BigNumber(amountCollectedInCake as string)
    const statusKey = Object.keys(LotteryStatus)[status]
    return {
      isLoading: false,
      status: LotteryStatus[statusKey],
      startTime,
      endTime,
      priceTicketInCake: priceTicketInCakeAsBN.toJSON(),
      discountDivisor,
      treasuryFee,
      firstTicketId,
      lastTicketId,
      amountCollectedInCake: amountCollectedInCakeAsBN.toJSON(),
      finalNumber,
    }
  } catch (error) {
    return {
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
    }
  }
}

export const fetchPublicData = async () => {
  try {
    const [currentLotteryId, maxNumberTicketsPerBuy] = (await makeBatchRequest([
      lotteryContract.methods.currentLotteryId().call,
      lotteryContract.methods.maxNumberTicketsPerBuy().call,
    ])) as [string, string]
    return {
      currentLotteryId,
      maxNumberTicketsPerBuy,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuy: null,
    }
  }
}

export const fetchTickets = async (account, lotteryId, cursor) => {
  try {
    const userTickets = await lotteryContract.methods
      .viewUserTicketNumbersAndStatusesForLottery(account, lotteryId, cursor, 1000)
      .call()
    const ticketIds = userTickets[0]
    const ticketNumbers = userTickets[1]
    const ticketStatuses = userTickets[2]

    const completeTicketData = ticketIds.map((ticketId, index) => {
      return {
        id: ticketId,
        number: ticketNumbers[index],
        status: ticketStatuses[index],
      }
    })
    return completeTicketData
  } catch (error) {
    return null
  }
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
