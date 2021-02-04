/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import teamsList from 'config/constants/teams'
import { Team } from 'config/constants/types'
import { TeamsById, TeamsState } from '../types'
import { getTeam, getTeams } from './helpers'

const teamsById: TeamsById = teamsList.reduce((accum, team) => {
  return {
    ...accum,
    [team.id]: team,
  }
}, {})

const initialState: TeamsState = {
  isInitialized: false,
  isLoading: true,
  data: teamsById,
}

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true
    },
    fetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
    teamFetchSucceeded: (state, action: PayloadAction<Team>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data[action.payload.id] = action.payload
    },
    teamsFetchSucceeded: (state, action: PayloadAction<TeamsById>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data = action.payload
    },
  },
})

// Actions
export const { fetchStart, teamFetchSucceeded, fetchFailed, teamsFetchSucceeded } = teamsSlice.actions

// Thunks
export const fetchTeam = (teamId: number) => async (dispatch) => {
  try {
    dispatch(fetchStart())
    const team = await getTeam(teamId)
    dispatch(teamFetchSucceeded(team))
  } catch (error) {
    dispatch(fetchFailed())
  }
}

export const fetchTeams = () => async (dispatch) => {
  try {
    dispatch(fetchStart())
    const teams = await getTeams()
    dispatch(teamsFetchSucceeded(teams))
  } catch (error) {
    dispatch(fetchFailed())
  }
}

export default teamsSlice.reducer
