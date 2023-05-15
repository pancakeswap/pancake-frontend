import { createFarmFetcher, SerializedFarm, SerializedFarmsState } from '@pancakeswap/farms'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { ChainId } from '@pancakeswap/sdk'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import { getFarmsPriceHelperLpFiles } from 'config/constants/priceHelperLps'
import stringify from 'fast-json-stable-stringify'
import keyBy from 'lodash/keyBy'
import type { AppState } from 'state'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { chains } from 'utils/wagmi'
import { getViemClients } from 'utils/viem'
import splitProxyFarms from 'views/Farms/components/YieldBooster/helpers/splitProxyFarms'
import { Address } from 'wagmi'
import { resetUserState } from '../global/actions'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import { fetchMasterChefFarmPoolLength } from './fetchMasterChefData'

const fetchFarmPublicDataPkg = async ({
  pids,
  chainId,
  chain,
}): Promise<[SerializedFarm[], number, number, string]> => {
  const farmsConfig = await getFarmConfig(chainId)
  const farmsCanFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)

  const { farmsWithPrice, poolLength, regularCakePerBlock, totalRegularAllocPoint } = await farmFetcher.fetchFarms({
    chainId,
    isTestnet: chain.testnet,
    farms: farmsCanFetch.concat(priceHelperLpsConfig),
  })
  return [farmsWithPrice, poolLength, regularCakePerBlock, totalRegularAllocPoint]
}

export const farmFetcher = createFarmFetcher(getViemClients)

const initialState: SerializedFarmsState = {
  data: [],
  chainId: null,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  totalRegularAllocPoint: '0',
  loadingKeys: {},
}

// Async thunks
export const fetchInitialFarmsData = createAsyncThunk<
  { data: SerializedFarm[]; chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('farms/fetchInitialFarmsData', async ({ chainId }) => {
  return getFarmConfig(chainId).then((farmDataList) => {
    return {
      data: farmDataList.map((farm) => ({
        ...farm,
        userData: {
          allowance: '0',
          tokenBalance: '0',
          stakedBalance: '0',
          earnings: '0',
        },
      })),
      chainId,
    }
  })
})

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number, number, string],
  { pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmsPublicDataAsync',
  async ({ pids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !farmFetcher.isChainSupported(chain.id)) throw new Error('chain not supported')
    return fetchFarmPublicDataPkg({ pids, chainId, chain }).catch((error) => {
      console.error(error)
      throw error
    })
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

interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  proxy?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

async function getBoostedFarmsStakeValue(farms, account, chainId, proxyAddress) {
  const [
    userFarmAllowances,
    userFarmTokenBalances,
    userStakedBalances,
    userFarmEarnings,
    proxyUserFarmAllowances,
    proxyUserStakedBalances,
    proxyUserFarmEarnings,
  ] = await Promise.all([
    fetchFarmUserAllowances(account, farms, chainId),
    fetchFarmUserTokenBalances(account, farms, chainId),
    fetchFarmUserStakedBalances(account, farms, chainId),
    fetchFarmUserEarnings(account, farms, chainId),
    // Proxy call
    fetchFarmUserAllowances(account, farms, chainId, proxyAddress),
    fetchFarmUserStakedBalances(proxyAddress, farms, chainId),
    fetchFarmUserEarnings(proxyAddress, farms, chainId),
  ])

  const farmAllowances = userFarmAllowances.map((farmAllowance, index) => {
    return {
      pid: farms[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
      proxy: {
        allowance: proxyUserFarmAllowances[index],
        // NOTE: Duplicate tokenBalance to maintain data structure consistence
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: proxyUserStakedBalances[index],
        earnings: proxyUserFarmEarnings[index],
      },
    }
  })

  return farmAllowances
}

async function getNormalFarmsStakeValue(farms, account, chainId) {
  const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
    fetchFarmUserAllowances(account, farms, chainId),
    fetchFarmUserTokenBalances(account, farms, chainId),
    fetchFarmUserStakedBalances(account, farms, chainId),
    fetchFarmUserEarnings(account, farms, chainId),
  ])

  const normalFarmAllowances = userFarmAllowances.map((_, index) => {
    return {
      pid: farms[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })

  return normalFarmAllowances
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: Address; pids: number[]; proxyAddress?: Address; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids, proxyAddress, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    const poolLength = state.farms.poolLength ?? (await fetchMasterChefFarmPoolLength(ChainId.BSC))
    const farmsConfig = await getFarmConfig(chainId)
    const farmsCanFetch = farmsConfig.filter(
      (farmConfig) => pids.includes(farmConfig.pid) && poolLength > farmConfig.pid,
    )
    if (proxyAddress && farmsCanFetch?.length && verifyBscNetwork(chainId)) {
      const { normalFarms, farmsWithProxy } = splitProxyFarms(farmsCanFetch)

      const [proxyAllowances, normalAllowances] = await Promise.all([
        farmsWithProxy
          ? getBoostedFarmsStakeValue(farmsWithProxy, account, chainId, proxyAddress)
          : Promise.resolve([]),
        normalFarms ? getNormalFarmsStakeValue(normalFarms, account, chainId) : Promise.resolve([]),
      ])

      return [...proxyAllowances, ...normalAllowances]
    }

    return getNormalFarmsStakeValue(farmsCanFetch, account, chainId)
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

export const serializeLoadingKey = (
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
    // Init farm data
    builder.addCase(fetchInitialFarmsData.fulfilled, (state, action) => {
      const { data, chainId } = action.payload
      state.data = data
      state.chainId = chainId
    })

    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock, totalRegularAllocPoint] = action.payload
      const farmPayloadPidMap = keyBy(farmPayload, 'pid')

      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayloadPidMap[farm.pid]
        return { ...farm, ...liveFarmData }
      })
      state.poolLength = poolLength
      state.regularCakePerBlock = regularCakePerBlock
      state.totalRegularAllocPoint = totalRegularAllocPoint
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      const userDataMap = keyBy(action.payload, 'pid')
      state.data = state.data.map((farm) => {
        const userDataEl = userDataMap[farm.pid]
        if (userDataEl) {
          return { ...farm, userData: userDataEl }
        }
        return farm
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
