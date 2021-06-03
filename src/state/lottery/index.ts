/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { LotteryState, LotteryRound, LotteryStatus } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

interface PublicLotteryData {
  currentLotteryId: string
  maxNumberTicketsPerBuy: string
}

const initialState: LotteryState = {
  currentLotteryId: null,
  maxNumberTicketsPerBuy: null,
  currentRound: {
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
}

const lotteryContract = getLotteryV2Contract()

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
    const userTickets = await lotteryContract.methods.viewUserTicketsForLottery(account, lotteryId, cursor, 1000).call()
    const ticketIds = userTickets[0]
    const ticketNumbersAndStatuses = await lotteryContract.methods.viewNumbersAndStatusesForTicketIds(ticketIds).call()
    const completeTicketData = ticketIds.map((ticketId, index) => {
      return {
        id: ticketId,
        number: ticketNumbersAndStatuses[0][index],
        status: ticketNumbersAndStatuses[1][index],
      }
    })
    return completeTicketData
  } catch (error) {
    return null
  }
}

export const fetchLotteryById = createAsyncThunk<LotteryRound, { lotteryId: string }>(
  'lottery/fetchById',
  async ({ lotteryId }) => {
    const lotteryInfo = await fetchLottery(lotteryId)
    return lotteryInfo
  },
)

export const fetchPublicLotteryData = createAsyncThunk<PublicLotteryData>('lottery/fetchPublicData', async () => {
  const publicData = await fetchPublicData()
  return publicData
})

export const fetchUserTickets = createAsyncThunk<any, { account: string; lotteryId: string }>(
  'lottery/fetchUserTickets',
  async ({ account, lotteryId }) => {
    const cursor = 0
    const userTickets = await fetchTickets(account, lotteryId, cursor)
    return userTickets
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
    builder.addCase(fetchLotteryById.fulfilled, (state, action: PayloadAction<LotteryRound>) => {
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
  },
})

// Actions
export const { setLotteryPublicData } = LotterySlice.actions

export default LotterySlice.reducer
