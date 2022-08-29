import { formatEther } from '@ethersproject/units'
import { getFarmConfig } from '@pancakeswap/farm-constants'
import { createFarmFetcher } from '@pancakeswap/farms'
import { ChainId } from '@pancakeswap/sdk'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import { FARM_API } from 'config/constants/endpoints'
import { getFarmsPriceHelperLpFiles } from 'config/constants/priceHelperLps'
import { FLAG_FARM } from 'config/flag'
import stringify from 'fast-json-stable-stringify'
import fromPairs from 'lodash/fromPairs'
import type { AppState } from 'state'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import multicall, { multicallv2 } from 'utils/multicall'
import { chains } from 'utils/wagmi'
import splitProxyFarms from 'views/Farms/components/YieldBooster/helpers/splitProxyFarms'
import { resetUserState } from '../global/actions'
import { SerializedFarm, SerializedFarmsState } from '../types'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import { fetchMasterChefFarmPoolLength } from './fetchMasterChefData'
import getFarmsPrices from './getFarmsPrices'

/**
 * @deprecated
 */
const fetchFetchPublicDataOld = async ({ pids, chainId }): Promise<[SerializedFarm[], number, number]> => {
  const [poolLength, [cakePerBlockRaw]] = await Promise.all([
    fetchMasterChefFarmPoolLength(chainId),
    multicall(masterchefABI, [
      {
        // BSC only
        address: getMasterChefAddress(ChainId.BSC),
        name: 'cakePerBlock',
        params: [true],
      },
    ]),
  ])

  const poolLengthAsBigNumber = new BigNumber(poolLength)
  const regularCakePerBlock = getBalanceAmount(new BigNumber(cakePerBlockRaw))
  const farmsConfig = await getFarmConfig(chainId)
  const farmsCanFetch = farmsConfig.filter(
    (farmConfig) => pids.includes(farmConfig.pid) && poolLengthAsBigNumber.gt(farmConfig.pid),
  )
  const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)

  const farms = await fetchFarms(farmsCanFetch.concat(priceHelperLpsConfig), chainId)
  const farmsWithPrices = farms.length > 0 ? getFarmsPrices(farms, chainId) : []
  return [farmsWithPrices, poolLengthAsBigNumber.toNumber(), regularCakePerBlock.toNumber()]
}

const fetchFarmPublicDataPkg = async ({ pids, chainId, chain }): Promise<[SerializedFarm[], number, number]> => {
  const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } =
    await farmFetcher.fetchMasterChefV2Data(chain.testnet)

  const regularCakePerBlock = formatEther(cakePerBlock)
  const farmsConfig = await getFarmConfig(chainId)
  const farmsCanFetch = farmsConfig.filter(
    (farmConfig) => pids.includes(farmConfig.pid) && poolLength.gt(farmConfig.pid),
  )
  const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)

  const farms = await farmFetcher.fetchFarms({
    farms: farmsCanFetch.concat(priceHelperLpsConfig),
    isTestnet: chain.testnet,
    chainId,
    totalRegularAllocPoint,
    totalSpecialAllocPoint,
  })
  const farmsWithPrices = farms.length > 0 ? getFarmsPrices(farms, chainId) : []

  return [farmsWithPrices, poolLength.toNumber(), +regularCakePerBlock]
}

const farmFetcher = createFarmFetcher(multicallv2)

const farmApiFetch = (chainId: number) => fetch(`${FARM_API}/${chainId}`).then((res) => res.json())

const initialState: SerializedFarmsState = {
  data: [],
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialFarmsData = createAsyncThunk<SerializedFarm[], { chainId: number }>(
  'farms/fetchInitialFarmsData',
  async ({ chainId }) => {
    const farmDataList = await getFarmConfig(chainId)
    return farmDataList.map((farm) => ({
      ...farm,
      userData: {
        allowance: '0',
        tokenBalance: '0',
        stakedBalance: '0',
        earnings: '0',
      },
    }))
  },
)

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number, number],
  { pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmsPublicDataAsync',
  async ({ pids, chainId }) => {
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !farmFetcher.isChainSupported(chain.id)) throw new Error('chain not supported')
    try {
      if (FLAG_FARM === 'old') {
        return fetchFetchPublicDataOld({ pids, chainId })
      }
      if (FLAG_FARM === 'api') {
        try {
          const { updatedAt, data, poolLength, regularCakePerBlock } = await farmApiFetch(chainId)
          return [Object.values(data), poolLength, regularCakePerBlock]
        } catch (error) {
          console.error(error)
          return fetchFarmPublicDataPkg({ pids, chainId, chain })
        }
      }
      return fetchFarmPublicDataPkg({ pids, chainId, chain })
    } catch (error) {
      console.error(error)
      throw error
    }
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
  { account: string; pids: number[]; proxyAddress?: string; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids, proxyAddress, chainId }, config) => {
    if (!farmFetcher.isChainSupported(chainId)) {
      throw new Error(`chain id ${chainId} not supported`)
    }
    const poolLength = config.getState().farms.poolLength ?? (await fetchMasterChefFarmPoolLength(chainId))
    const farmsConfig = await getFarmConfig(chainId)
    const farmsCanFetch = farmsConfig.filter(
      (farmConfig) => pids.includes(farmConfig.pid) && poolLength > farmConfig.pid,
    )
    if (proxyAddress && farmsCanFetch?.length) {
      const { normalFarms, farmsWithProxy } = splitProxyFarms(farmsCanFetch)

      const [proxyAllowances, normalAllowances] = await Promise.all([
        getBoostedFarmsStakeValue(farmsWithProxy, account, chainId, proxyAddress),
        getNormalFarmsStakeValue(normalFarms, account, chainId),
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
    // Init farm data
    builder.addCase(fetchInitialFarmsData.fulfilled, (state, action) => {
      const farmData = action.payload
      state.data = farmData
    })

    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock] = action.payload
      const farmPayloadPidMap = fromPairs(farmPayload.map((farmData) => [farmData.pid, farmData]))
      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayloadPidMap[farm.pid]
        return { ...farm, ...liveFarmData }
      })
      state.poolLength = poolLength
      state.regularCakePerBlock = regularCakePerBlock
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      const userDataMap = fromPairs(action.payload.map((userDataEl) => [userDataEl.pid, userDataEl]))
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
