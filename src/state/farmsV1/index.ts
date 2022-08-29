import { ChainId } from '@pancakeswap/sdk'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
  // eslint-disable-next-line import/no-unresolved
} from '@reduxjs/toolkit/dist/matchers'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import stringify from 'fast-json-stable-stringify'
import { getFarmConfig } from '@pancakeswap/farm-constants'
import type { AppState } from 'state'
import { getFarmsPriceHelperLpFiles } from 'config/constants/priceHelperLps/index'
import fetchFarms from './fetchFarms'
import getFarmsPrices from './getFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { SerializedFarmsState, SerializedFarm } from '../types'
import { fetchMasterChefFarmPoolLength } from './fetchMasterChefData'

const initialState: SerializedFarmsState = {
  data: [],
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number],
  number[],
  {
    state: AppState
  }
>(
  'farmsV1/fetchFarmsPublicDataAsync',
  async (pids) => {
    const farmsConfig = await getFarmConfig(ChainId.BSC)
    const poolLength = await fetchMasterChefFarmPoolLength()
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.v1pid))
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.v1pid))

    // Add price helper farms
    const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(56)
    const farmsWithPriceHelpers = farmsCanFetch.concat(priceHelperLpsConfig)

    const farms = await fetchFarms(farmsWithPriceHelpers)
    const farmsWithPrices = getFarmsPrices(farms)

    // Filter out price helper LP config farms
    const farmsWithoutHelperLps = farmsWithPrices.filter((farm: SerializedFarm) => {
      return farm.v1pid || farm.v1pid === 0
    })

    return [farmsWithoutHelperLps, poolLength.toNumber()]
  },
  {
    condition: (arg, { getState }) => {
      const { farmsV1 } = getState()
      if (farmsV1.loadingKeys[stringify({ type: fetchFarmsPublicDataAsync.typePrefix, arg })]) {
        console.debug('farms action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: string; pids: number[] },
  {
    state: AppState
  }
>(
  'farmsV1/fetchFarmUserDataAsync',
  async ({ account, pids }) => {
    const farmsConfig = await getFarmConfig(ChainId.BSC)
    const poolLength = await fetchMasterChefFarmPoolLength()
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.v1pid))
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.v1pid))
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsCanFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsCanFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsCanFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsCanFetch)

    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsCanFetch[index].v1pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    })
  },
  {
    condition: (arg, { getState }) => {
      const { farmsV1 } = getState()
      if (farmsV1.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
        console.debug('farms user action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}

export const farmsSlice = createSlice({
  name: 'FarmsV1',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength] = action.payload
      if (state.data.length > 0) {
        state.data = state.data.map((farm) => {
          const liveFarmData = farmPayload.find((farmData) => farmData.v1pid === farm.v1pid)
          return { ...farm, ...liveFarmData }
        })
      } else {
        state.data = farmPayload
      }
      state.poolLength = poolLength
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.v1pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })

    builder.addMatcher(isAnyOf(fetchFarmUserDataAsync.pending, fetchFarmsPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchFarmUserDataAsync.fulfilled, fetchFarmsPublicDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchFarmsPublicDataAsync.rejected, fetchFarmUserDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default farmsSlice.reducer
