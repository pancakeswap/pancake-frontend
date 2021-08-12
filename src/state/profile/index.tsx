import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileState } from 'state/types'
import type { AppDispatch } from 'state'
import { Nft } from 'config/constants/types'
import { getProfile, getProfileAvatar, GetProfileResponse, getUsername } from './helpers'

const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
  profileAvatars: {},
}

export const fetchProfileAvatar = createAsyncThunk<{ account: string; nft: Nft }, string>(
  'profile/fetchProfileAvatar',
  async (account) => {
    const nft = await getProfileAvatar(account)
    return { account, nft }
  },
)

export const fetchProfileUsername = createAsyncThunk<{ account: string; username: string }, string>(
  'profile/fetchProfileUsername',
  async (account) => {
    const username = await getUsername(account)
    return { account, username }
  },
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileFetchStart: (state) => {
      state.isLoading = true
    },
    profileFetchSucceeded: (state, action: PayloadAction<GetProfileResponse>) => {
      const { profile, hasRegistered } = action.payload

      state.isInitialized = true
      state.isLoading = false
      state.hasRegistered = hasRegistered
      state.data = profile
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
  extraReducers: (builder) => {
    builder.addCase(fetchProfileUsername.fulfilled, (state, action) => {
      const { account, username } = action.payload

      if (state.profileAvatars[account]) {
        state.profileAvatars[account] = {
          ...state.profileAvatars[account],
          username,
        }
      } else {
        state.profileAvatars[account] = { username, nft: null }
      }
    })
    builder.addCase(fetchProfileAvatar.fulfilled, (state, action) => {
      const { account, nft } = action.payload

      if (state.profileAvatars[account]) {
        state.profileAvatars[account] = {
          ...state.profileAvatars[account],
          nft,
        }
      } else {
        state.profileAvatars[account] = { username: null, nft }
      }
    })
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
