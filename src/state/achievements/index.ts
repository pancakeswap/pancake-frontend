import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AchievementState, Achievement, AchievementFetchStatus } from '../types'
import { getAchievements } from './helpers'

const initialState: AchievementState = {
  achievements: [],
  achievementFetchStatus: AchievementFetchStatus.NOT_FETCHED,
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
      state.achievementFetchStatus = AchievementFetchStatus.NOT_FETCHED
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAchievements.pending, (state) => {
      state.achievementFetchStatus = AchievementFetchStatus.FETCHING
    })
    builder.addCase(fetchAchievements.fulfilled, (state, action) => {
      state.achievementFetchStatus = AchievementFetchStatus.FETCHED
      state.achievements = action.payload
    })
    builder.addCase(fetchAchievements.rejected, (state) => {
      state.achievementFetchStatus = AchievementFetchStatus.ERROR
    })
  },
})

// Actions
export const { addAchievement, clearAchievements } = achievementSlice.actions

export default achievementSlice.reducer
