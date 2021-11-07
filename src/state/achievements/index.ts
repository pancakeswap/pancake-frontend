import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import { AchievementState, Achievement } from '../types'
import { getAchievements } from './helpers'

const initialState: AchievementState = {
  achievements: [],
  achievementFetchStatus: FetchStatus.INITIAL,
}

export const fetchAchievements = createAsyncThunk<Achievement[], string>(
  'achievements/fetchAchievements',
  async (account) => {
    const achievements = await getAchievements(account)
    return achievements
  },
)

export const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.achievements.push(action.payload)
    },
    clearAchievements: (state) => {
      state.achievements = []
      state.achievementFetchStatus = FetchStatus.INITIAL
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAchievements.pending, (state) => {
      state.achievementFetchStatus = FetchStatus.FETCHING
    })
    builder.addCase(fetchAchievements.fulfilled, (state, action) => {
      state.achievementFetchStatus = FetchStatus.FETCHED
      state.achievements = action.payload
    })
    builder.addCase(fetchAchievements.rejected, (state) => {
      state.achievementFetchStatus = FetchStatus.FAILED
    })
  },
})

// Actions
export const { addAchievement, clearAchievements } = achievementSlice.actions

export default achievementSlice.reducer
