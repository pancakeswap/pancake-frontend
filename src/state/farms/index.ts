/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

const initialState: FarmsState = { data: [...farmsConfig], loadArchivedFarmsData: false }

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setLoadArchivedFarmsData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch, getState) => {
  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const farms = await fetchFarms(farmsToFetch)
  dispatch(setFarmsPublicData(farms))
}
export const fetchFarmUserDataAsync = (account: string) => async (dispatch, getState) => {
  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      pid: farmsToFetch[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
