import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  PotteryState,
  SerializedPotteryUserData,
  SerializedPotteryPublicData,
  PotteryDepositStatus,
  PotteryRoundInfo,
} from 'state/types'
import { resetUserState } from '../global/actions'
import { fetchPotteryFinisedRound } from './fetchPotteryRound'
import { fetchPublicPotteryValue, fetchTotalLockedValue } from './fetchPottery'
import {
  fetchPotterysAllowance,
  fetchVaultUserData,
  fetchUserDrawData,
  fetchWithdrawAbleData,
} from './fetchUserPottery'

const initialState: PotteryState = Object.freeze({
  publicData: {
    lastDrawId: '',
    totalPrize: null,
    getStatus: PotteryDepositStatus.BEFORE_LOCK,
    totalLockCake: null,
    totalSupply: null,
    lockStartTime: '',
    totalLockedValue: null,
  },
  userData: {
    isLoading: true,
    allowance: null,
    previewDepositBalance: null,
    stakingTokenBalance: null,
    rewards: null,
    winCount: null,
    withdrawAbleData: [],
  },
  finishedRoundInfo: {
    isFetched: false,
    roundId: null,
    drawDate: '',
    prizePot: '',
    totalPlayers: '',
    txid: '',
    winners: [],
  },
})

export const fetchPublicPotteryDataAsync = createAsyncThunk<SerializedPotteryPublicData>(
  'pottery/fetchPublicPotteryData',
  async () => {
    const [publicPotteryData, totalLocedValue] = await Promise.all([fetchPublicPotteryValue(), fetchTotalLockedValue()])

    return { ...publicPotteryData, ...totalLocedValue }
  },
)

export const fetchPotteryUserDataAsync = createAsyncThunk<SerializedPotteryUserData, string>(
  'pottery/fetchPotteryUserData',
  async (account, { rejectWithValue }) => {
    try {
      const [allowance, vaultUserData, drawData, withdrawAbleData] = await Promise.all([
        fetchPotterysAllowance(account),
        fetchVaultUserData(account),
        fetchUserDrawData(account),
        fetchWithdrawAbleData(account),
      ])

      const userData = {
        allowance,
        previewDepositBalance: vaultUserData.previewDepositBalance,
        stakingTokenBalance: vaultUserData.stakingTokenBalance,
        rewards: drawData.rewards,
        winCount: drawData.winCount,
        withdrawAbleData,
      }

      return userData
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchPotteryRoundData = createAsyncThunk<PotteryRoundInfo, string>(
  'pottery/fetchPotteryRound',
  async (roundId) => {
    const response = await fetchPotteryFinisedRound(roundId)
    return response
  },
)

export const PotterySlice = createSlice({
  name: 'Pottery',
  initialState,
  reducers: {
    setFinishedRoundInfoFetched: (state, action) => {
      const isFetched = action.payload
      state.finishedRoundInfo = {
        ...state.finishedRoundInfo,
        isFetched,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.userData = { ...initialState.userData }
    })
    builder.addCase(
      fetchPublicPotteryDataAsync.fulfilled,
      (state, action: PayloadAction<SerializedPotteryPublicData>) => {
        state.publicData = { ...action.payload }
      },
    )
    builder.addCase(fetchPotteryUserDataAsync.fulfilled, (state, action: PayloadAction<SerializedPotteryUserData>) => {
      const userData = action.payload
      state.userData = {
        ...userData,
        isLoading: false,
      }
    })
    builder.addCase(fetchPotteryRoundData.fulfilled, (state, action: PayloadAction<PotteryRoundInfo>) => {
      state.finishedRoundInfo = { ...action.payload }
    })
  },
})

// Actions
export const { setFinishedRoundInfoFetched } = PotterySlice.actions

export default PotterySlice.reducer
