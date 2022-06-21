import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PotteryState, SerializedPotteryUserData, SerializedPotteryPublicData, PotteryDepositStatus } from 'state/types'
import { resetUserState } from '../global/actions'
import { fetchPublicPotteryValue } from './fetchPottery'
import { fetchPotterysAllowance, fetchVaultUserData, fetchDrawUserData } from './fetchUserPottery'

const initialState: PotteryState = Object.freeze({
  publicData: {
    lastDrawId: '0',
    totalPrize: null,
    getStatus: PotteryDepositStatus.BEFORE_LOCK,
    totalLockCake: null,
    totalSupply: null,
    lockStartTime: '0',
  },
  userData: {
    isLoading: true,
    allowance: null,
    previewDepositBalance: null,
    stakingTokenBalance: null,
    rewards: null,
    winCount: null,
  },
})

export const fetchPublicPotteryDataAsync = createAsyncThunk<SerializedPotteryPublicData>(
  'pottery/fetchPublicPotteryData',
  async () => {
    const publicPotteryData = await fetchPublicPotteryValue()
    return publicPotteryData
  },
)

export const fetchPotteryUserDataAsync = createAsyncThunk<SerializedPotteryUserData, string>(
  'pottery/fetchPotteryUserData',
  async (account, { rejectWithValue }) => {
    try {
      const [allowance, vaultUserData, drawData] = await Promise.all([
        fetchPotterysAllowance(account),
        fetchVaultUserData(account),
        fetchDrawUserData(account),
      ])

      const userData = {
        allowance,
        previewDepositBalance: vaultUserData.previewDepositBalance,
        stakingTokenBalance: vaultUserData.stakingTokenBalance,
        rewards: drawData.rewards,
        winCount: drawData.winCount,
      }

      return userData
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const PotterySlice = createSlice({
  name: 'Pottery',
  initialState,
  reducers: {},
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
  },
})

export default PotterySlice.reducer
