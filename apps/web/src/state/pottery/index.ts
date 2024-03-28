import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'state'
import {
  PotteryDepositStatus,
  PotteryRoundInfo,
  PotteryState,
  SerializedPotteryPublicData,
  SerializedPotteryUserData,
} from 'state/types'
import { Address } from 'viem'
import { resetUserState } from '../global/actions'
import {
  fetchLastVaultAddress,
  fetchLatestRoundId,
  fetchPublicPotteryValue,
  fetchTotalLockedValue,
} from './fetchPottery'
import { fetchPotteryFinishedRound } from './fetchPotteryRound'
import {
  fetchPotterysAllowance,
  fetchUserDrawData,
  fetchVaultUserData,
  fetchWithdrawAbleData,
} from './fetchUserPottery'

const initialState: PotteryState = Object.freeze({
  lastVaultAddress: null,
  publicData: {
    lastDrawId: '',
    totalPrize: '',
    getStatus: PotteryDepositStatus.BEFORE_LOCK,
    totalLockCake: '',
    totalSupply: '',
    lockStartTime: '',
    lockTime: 0,
    totalLockedValue: '',
    latestRoundId: '',
    maxTotalDeposit: '',
  },
  userData: {
    isLoading: true,
    allowance: '',
    previewDepositBalance: '',
    stakingTokenBalance: '',
    rewards: '',
    winCount: '',
    withdrawAbleData: [],
  },
  finishedRoundInfo: {
    isFetched: false,
    roundId: '',
    drawDate: '',
    prizePot: '',
    totalPlayers: '',
    txid: '',
    winners: [],
    lockDate: '',
  },
})

export const fetchLastVaultAddressAsync = createAsyncThunk<string>('pottery/fetchLastVaultAddress', async () => {
  const lastVaultAddress = await fetchLastVaultAddress()
  return lastVaultAddress
})

export const fetchPublicPotteryDataAsync = createAsyncThunk<SerializedPotteryPublicData | undefined>(
  'pottery/fetchPublicPotteryData',
  async (arg, { getState }) => {
    const state = getState()
    const potteryVaultAddress = (state as AppState).pottery.lastVaultAddress

    if (!potteryVaultAddress) return undefined

    const [publicPotteryData, totalLockedValue, latestRoundId] = await Promise.all([
      fetchPublicPotteryValue(potteryVaultAddress),
      fetchTotalLockedValue(potteryVaultAddress),
      fetchLatestRoundId(),
    ])
    return { ...publicPotteryData, ...totalLockedValue, ...latestRoundId }
  },
)

export const fetchPotteryUserDataAsync = createAsyncThunk<SerializedPotteryUserData | undefined, string>(
  'pottery/fetchPotteryUserData',
  async (account, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const potteryVaultAddress = (state as AppState).pottery.lastVaultAddress

      if (!potteryVaultAddress) return undefined

      const [allowance, vaultUserData, drawData, withdrawAbleData] = await Promise.all([
        fetchPotterysAllowance(account as Address, potteryVaultAddress),
        fetchVaultUserData(account as Address, potteryVaultAddress),
        fetchUserDrawData(account as Address),
        fetchWithdrawAbleData(account as Address),
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

export const fetchPotteryRoundData = createAsyncThunk<PotteryRoundInfo, number>(
  'pottery/fetchPotteryRound',
  async (roundId) => {
    const response = await fetchPotteryFinishedRound(roundId)
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
    builder.addCase(fetchLastVaultAddressAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.lastVaultAddress = action.payload as Address
    })
    builder.addCase(
      fetchPublicPotteryDataAsync.fulfilled,
      (state, action: PayloadAction<SerializedPotteryPublicData | undefined>) => {
        if (action.payload) {
          state.publicData = { ...action.payload }
        }
      },
    )
    builder.addCase(
      fetchPotteryUserDataAsync.fulfilled,
      (state, action: PayloadAction<SerializedPotteryUserData | undefined>) => {
        const userData = action.payload

        if (userData) {
          state.userData = {
            ...userData,
            isLoading: false,
          }
        }
      },
    )
    builder.addCase(fetchPotteryRoundData.fulfilled, (state, action: PayloadAction<PotteryRoundInfo>) => {
      state.finishedRoundInfo = { ...action.payload }
    })
  },
})

// Actions
export const { setFinishedRoundInfoFetched } = PotterySlice.actions

export default PotterySlice.reducer
