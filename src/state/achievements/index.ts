import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import { AchievementState, Achievement } from '../types'
import { getAchievements } from './helpers'

const initialState: AchievementState = {
  achievements: [],
  achievementFetchStatus: FetchStatus.Idle,
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAchievements.pending, (state) => {
      state.achievementFetchStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchAchievements.fulfilled, (state, action) => {
      state.achievementFetchStatus = FetchStatus.Fetched
      state.achievements = action.payload
    })
    builder.addCase(fetchAchievements.rejected, (state) => {
      state.achievementFetchStatus = FetchStatus.Failed
    })
  },
})

// Actions
export const { addAchievement } = achievementSlice.actions

export default achievementSlice.reducer
