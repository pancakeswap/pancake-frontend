import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileState } from 'state/types'
import type { AppDispatch } from 'state'
import getProfile, { GetProfileResponse } from './getProfile'

const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileFetchStart: (state) => {
      state.isLoading = true
    },
    profileFetchSucceeded: (_state, action: PayloadAction<GetProfileResponse>) => {
      const { profile, hasRegistered } = action.payload

      return {
        isInitialized: true,
        isLoading: false,
        hasRegistered,
        data: profile,
      }
    },
    profileFetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
    profileClear: () => ({
      ...initialState,
      isLoading: false,
    }),
    addPoints: (state, action: PayloadAction<number>) => {
      state.data.points += action.payload
    },
  },
})

// Actions
export const { profileFetchStart, profileFetchSucceeded, profileFetchFailed, profileClear, addPoints } =
  profileSlice.actions

// Thunks
// TODO: this should be an AsyncThunk
export const fetchProfile = (address: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(profileFetchStart())
    const response = await getProfile(address)
    dispatch(profileFetchSucceeded(response))
  } catch (error) {
    dispatch(profileFetchFailed())
  }
}

export default profileSlice.reducer
