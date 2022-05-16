import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
  // eslint-disable-next-line import/no-unresolved
} from '@reduxjs/toolkit/dist/matchers'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import stringify from 'fast-json-stable-stringify'
import farmsConfig from 'config/constants/farms'
import multicall from 'utils/multicall'
import masterchefABI from 'config/abi/masterchef.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import type { AppState } from 'state'
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
import { resetUserState } from '../global/actions'
import fetchFarmsWithAuctions from './fetchFarmsWithAuctions'
import getFarmsAuctionData from './getFarmsAuctionData'

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
  loadingKeys: {},
}

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number, number],
  number[],
  {
    state: AppState
  }
>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids) => {
    const masterChefAddress = getMasterChefAddress()
    const calls = [
      {
        address: masterChefAddress,
        name: 'poolLength',
      },
      {
        address: masterChefAddress,
        name: 'cakePerBlock',
        params: [true],
      },
    ]
    const [[poolLength], [cakePerBlockRaw]] = await multicall(masterchefABI, calls)
    const regularCakePerBlock = getBalanceAmount(ethersToBigNumber(cakePerBlockRaw))
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid))

    const farms = await fetchFarms(farmsCanFetch)
    const farmsWithPrices = getFarmsPrices(farms)

    return [farmsWithPrices, poolLength.toNumber(), regularCakePerBlock.toNumber()]
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmsPublicDataAsync.typePrefix, arg })]) {
        console.debug('farms action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export const fetchFarmsAuctionDataAsync = createAsyncThunk<
  { winnerFarms: string[]; auctionHostingEndDate: string },
  number
>('farms/fetchFarmsAuctionDataAsync', async (currentBlock) => {
  return fetchFarmsWithAuctions(currentBlock)
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
  { account: string; pids: number[] },
  {
    state: AppState
  }
>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids }) => {
    const poolLength = await fetchMasterChefFarmPoolLength()
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid))
    const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
      fetchFarmUserAllowances(account, farmsCanFetch),
      fetchFarmUserTokenBalances(account, farmsCanFetch),
      fetchFarmUserStakedBalances(account, farmsCanFetch),
      fetchFarmUserEarnings(account, farmsCanFetch),
    ])

    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsCanFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    })
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
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
  name: 'Farms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map((farm) => {
        return {
          ...farm,
          userData: {
            allowance: '0',
            tokenBalance: '0',
            stakedBalance: '0',
            earnings: '0',
          },
        }
      })
      state.userDataLoaded = false
    })
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
      state.poolLength = poolLength
      state.regularCakePerBlock = regularCakePerBlock
    })

    builder.addCase(fetchFarmsAuctionDataAsync.fulfilled, (state, action) => {
      const { winnerFarms, auctionHostingEndDate } = action.payload
      const farmsWithAuction = getFarmsAuctionData(state.data, winnerFarms, auctionHostingEndDate)
      state.data = farmsWithAuction
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
