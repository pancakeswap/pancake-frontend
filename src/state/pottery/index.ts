import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PotteryState } from 'state/types'
import { resetUserState } from '../global/actions'
import { fetchPotterysAllowance } from './fetchUserPottery'

const initialState: PotteryState = Object.freeze({
  currentPotteryId: null,
  currentRound: {
    isLoading: false,
  },
  userData: {
    allowance: null,
  },
  userDataLoaded: false,
})

export const fetchPotteryUserDataAsync = createAsyncThunk<{ allowance: any }, string>(
  'pottery/fetchPotteryUserData',
  async (account, { rejectWithValue }) => {
    try {
      const [allowance] = await Promise.all([fetchPotterysAllowance(account)])

      const userData = {
        allowance,
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
    builder.addCase(fetchPotteryUserDataAsync.fulfilled, (state, action: PayloadAction<{ allowance: any }>) => {
      const userData = action.payload
      state.userData = userData
      state.userDataLoaded = true
    })
  },
})

export default PotterySlice.reducer
