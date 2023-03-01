import { farmsV3Map } from '@pancakeswap/farms/constants/index.v3'
import {
  createFarmFetcherV3,
  fetchCommonTokenUSDValue,
  SerializedFarmsV3State,
  SerializedFarmV3,
} from '@pancakeswap/farms'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { getFarmsPriceHelperLpFiles } from 'config/constants/priceHelperLps'
import stringify from 'fast-json-stable-stringify'
import type { AppState } from 'state'

import { multicallv2 } from 'utils/multicall'
import { chains } from 'utils/wagmi'
import { TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { resetUserState } from 'state/global/actions'
import { serializeLoadingKey } from 'state/farms'
import keyBy from 'lodash/keyBy'

export const farmV3Fetcher = createFarmFetcherV3(multicallv2)

// Philip TODO: Replace FarmsState
const initialState: SerializedFarmsV3State = {
  data: [],
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

// NOTE: Duplicate fetchFarmPublicDataPkg
const fetchFarmV3PublicDataPkg = async ({ pids, chainId }): Promise<[SerializedFarmV3[], number]> => {
  // Philip TODO: using dynamic import
  const farmsConfig = farmsV3Map[chainId]
  const farmsCanFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

  const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)

  const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

  const tvls: TvlMap = {}

  const { farmsWithPrice, poolLength } = await farmV3Fetcher.fetchFarms({
    chainId,
    commonPrice,
    tvlMap: tvls,
    farms: farmsCanFetch.concat(priceHelperLpsConfig),
  })

  return [farmsWithPrice, poolLength]
}

function mapInitialFarm(farm: SerializedFarmV3) {
  return {
    ...farm,
    unstakedPositions: {},
    stakedPositions: {},
  }
}

// Async thunks
export const fetchInitialFarmsV3Data = createAsyncThunk<
  { data: SerializedFarmV3[]; chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('farmsV3/fetchInitialFarmsV3Data', async ({ chainId }) => {
  const farmsV3List = farmsV3Map[chainId] ?? []

  return {
    data: farmsV3List.map(mapInitialFarm),
    chainId,
  }
})

export const fetchFarmsV3PublicDataAsync = createAsyncThunk<
  [SerializedFarmV3[], number],
  { pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farmsV3/fetchFarmsV3PublicDataAsync',
  async ({ pids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farmsV3.chainId !== chainId) {
      await dispatch(fetchInitialFarmsV3Data({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !farmV3Fetcher.isChainSupported(chain.id)) throw new Error('chain not supported')
    try {
      return fetchFarmV3PublicDataPkg({ pids, chainId })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { farmsV3 } = getState()
      if (farmsV3.loadingKeys[stringify({ type: fetchFarmsV3PublicDataAsync.typePrefix, arg })]) {
        console.debug('farmsV3 action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export const farmsV3Slice = createSlice({
  name: 'FarmsV3',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = state.data.map(mapInitialFarm)
      state.userDataLoaded = false
    })
    // Init farm data
    builder.addCase(fetchInitialFarmsV3Data.fulfilled, (state, action) => {
      const { data, chainId } = action.payload
      state.data = data
      state.chainId = chainId
    })

    // Update farms with live data
    builder.addCase(fetchFarmsV3PublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength] = action.payload
      const farmPayloadPidMap = keyBy(farmPayload, 'pid')

      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayloadPidMap[farm.pid]
        return { ...farm, ...liveFarmData }
      })
      state.poolLength = poolLength
    })

    builder.addMatcher(isAnyOf(fetchFarmsV3PublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(isAnyOf(fetchFarmsV3PublicDataAsync.fulfilled), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
    })
    builder.addMatcher(isAnyOf(fetchFarmsV3PublicDataAsync.rejected), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
    })
  },
})

export default farmsV3Slice.reducer
