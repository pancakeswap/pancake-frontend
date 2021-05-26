/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { FarmConfig } from 'config/constants/types'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import fetchFarm from './fetchFarm'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

// Async thunks

export const fetchFarmsData = createAsyncThunk('farms/fetchFarmsData', async () => {
  const farmsData = await fetchFarms(nonArchivedFarms)
  return farmsData
})

export const fetchFarmData = createAsyncThunk<{ pid: number; data: Farm }, number>(
  'farms/fetchFarmData',
  async (pid) => {
    const farm = farmsConfig.find((farmConfig) => farmConfig.pid === pid)
    const farmData = await fetchFarm(farm)
    return { pid: farm.pid, data: farmData }
  },
)

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
      state.userDataLoaded = true
    },
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Same as "setFarmsPublicData" above
    builder.addCase(fetchFarmsData.fulfilled, (state, action) => {
      const liveFarmsData = action.payload as FarmConfig[]

      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Updating a single farm
    builder.addCase(fetchFarmData.fulfilled, (state, action) => {
      const { pid, data } = action.payload
      const farmIndex = state.data.findIndex((farm) => farm.pid === pid)

      if (farmIndex >= 0) {
        const newFarmData = { ...state.data[farmIndex], ...data }
        state.data[farmIndex] = newFarmData
      }
    })
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setLoadArchivedFarmsData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch, getState) => {
  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)
  const farms = await fetchFarms(farmsWithPriceHelpers)
  const farmsWithPrices = await fetchFarmsPrices(farms)
  // Filter out price helper LP config farms
  const farmsWithoutHelperLps = farmsWithPrices.filter((farm: Farm) => {
    return farm.pid || farm.pid === 0
  })
  dispatch(setFarmsPublicData(farmsWithoutHelperLps))
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
