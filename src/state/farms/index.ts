import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { SerializedFarmConfig } from 'config/constants/types'
import isArchivedPid from 'utils/farmHelpers'
import type { AppState } from '../index'
import { SerializedFarm, SerializedFarmsState } from '../types'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: SerializedFarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  batchFetching: false,
}

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
const fetchFarmsPublicData = async (farmsToFetch: SerializedFarm[]) => {
  // Add price helper farms
  const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)

  const farms = await fetchFarms(farmsWithPriceHelpers)
  const farmsWithPrices = await fetchFarmsPrices(farms)

  // Filter out price helper LP config farms
  const farmsWithoutHelperLps = farmsWithPrices.filter((farm: SerializedFarm) => {
    return farm.pid || farm.pid === 0
  })

  return farmsWithoutHelperLps
}

export const fetchFarmsPublicDataAsync = createAsyncThunk<SerializedFarm[], SerializedFarm[]>(
  'farms/fetchFarmsPublicDataAsync',
  fetchFarmsPublicData,
)

export const fetchFarmsPublicDataCancellableAsync = createAsyncThunk<
  SerializedFarm[],
  SerializedFarm[],
  { state: AppState }
>('farms/fetchFarmsPublicDataCancellableAsync', fetchFarmsPublicData, {
  condition: (_, { getState }) => {
    const { farms } = getState()
    return !farms.batchFetching
  },
})

interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: string; farmsToFetch: SerializedFarmConfig[] }
>('farms/fetchFarmUserDataAsync', async ({ account, farmsToFetch }) => {
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

  return userFarmAllowances.map((farmAllowance, index) => {
    return {
      pid: farmsToFetch[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })
})

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFarmsPublicDataCancellableAsync.pending, (state) => {
      state.batchFetching = true
    })
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataCancellableAsync.fulfilled, (state, action) => {
      state.batchFetching = false
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

export default farmsSlice.reducer
