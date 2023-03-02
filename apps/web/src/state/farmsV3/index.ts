import { farmsV3Map } from '@pancakeswap/farms/constants/index.v3'
import { createFarmFetcherV3, SerializedFarmsV3State, SerializedFarmV3 } from '@pancakeswap/farms'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'

import stringify from 'fast-json-stable-stringify'
import type { AppState } from 'state'

import { multicallv2 } from 'utils/multicall'
import { chains } from 'utils/wagmi'
import { resetUserState } from 'state/global/actions'
import { serializeLoadingKey } from 'state/farms'
import keyBy from 'lodash/keyBy'
import { FARM_API } from 'config/constants/endpoints'

export const farmV3Fetcher = createFarmFetcherV3(multicallv2)

// Philip TODO: Replace FarmsState
const initialState: SerializedFarmsV3State = {
  data: [],
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

const farmV3ApiFetch = (chainId: number) => fetch(`${FARM_API}/v3/${chainId}/farms`).then((res) => res.json())

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
    data: farmsV3List,
    chainId,
  }
})

export const fetchFarmsV3PublicDataAsync = createAsyncThunk<
  [SerializedFarmV3[], number],
  { chainId: number },
  {
    state: AppState
  }
>(
  'farmsV3/fetchFarmsV3PublicDataAsync',
  async ({ chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farmsV3.chainId !== chainId) {
      await dispatch(fetchInitialFarmsV3Data({ chainId }))
    }

    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !farmV3Fetcher.isChainSupported(chain.id)) throw new Error('chain not supported')
    try {
      const { farmsWithPrice, poolLength } = await farmV3ApiFetch(chainId)

      return [farmsWithPrice, poolLength]
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
