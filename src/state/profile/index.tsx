/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile, ProfileState } from 'state/types'
import getProfile from './getProfile'

const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  data: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data = action.payload
    },
    clearProfile: (state) => {
      state.isLoading = false
      state.data = null
    },
  },
})

// Actions
export const { clearProfile, setProfile } = profileSlice.actions

// Thunks
export const fetchProfile = (address: string) => async (dispatch) => {
  try {
    const profile = await getProfile(address)

    dispatch(setProfile(profile))
  } catch (error) {
    dispatch(clearProfile())
  }
}

export default profileSlice.reducer
