import { ChainId } from '@pancakeswap/chains'
import { createFarmFetcher, getLegacyFarmConfig, SerializedFarm, SerializedFarmsState } from '@pancakeswap/farms'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import { getFarmsPriceHelperLpFiles } from 'config/constants/priceHelperLps'
import stringify from 'fast-json-stable-stringify'
import keyBy from 'lodash/keyBy'
import { fetchStableFarmsAvgInfo, fetchV2FarmsAvgInfo } from 'queries/farms'
import type { AppState } from 'state'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { getViemClients } from 'utils/viem'
import { chains } from 'utils/wagmi'
import { Address } from 'viem'
import splitProxyFarms from 'views/Farms/components/YieldBooster/helpers/splitProxyFarms'
import { resetUserState } from '../global/actions'
import {
  fetchFarmBCakeWrapperUserAllowances,
  fetchFarmUserAllowances,
  fetchFarmUserBCakeWrapperConstants,
  fetchFarmUserBCakeWrapperEarnings,
  fetchFarmUserBCakeWrapperRewardPerSec,
  fetchFarmUserBCakeWrapperStakedBalances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import { fetchMasterChefFarmPoolLength } from './fetchMasterChefData'

const fetchFarmPublicDataPkg = async ({
  pids,
  chainId,
  chain,
}): Promise<[SerializedFarm[], number, number, string, Record<string, number>]> => {
  const farmsConfig = await getLegacyFarmConfig(chainId)
  const farmsCanFetch = farmsConfig?.filter((farmConfig) => pids.includes(farmConfig.pid)) ?? []
  const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)

  const { farmsWithPrice, poolLength, regularCakePerBlock, totalRegularAllocPoint } = await farmFetcher.fetchFarms({
    chainId,
    isTestnet: chain.testnet,
    farms: farmsCanFetch.concat(priceHelperLpsConfig),
  })

  const farmsWithPriceWithFallback = await Promise.all(
    farmsWithPrice.map(async (farm) => {
      const tokenPriceVsQuoteBn = new BigNumber(farm.tokenPriceVsQuote)
      if (tokenPriceVsQuoteBn.gt(0)) {
        const quoteTokenPriceStable = new BigNumber(farm.quoteTokenPriceBusd)
        if (quoteTokenPriceStable.eq(0)) {
          try {
            const data = await explorerApiClient
              .GET('/cached/tokens/{chainName}/{address}/price', {
                signal: null,
                params: {
                  path: {
                    address: farm.quoteToken.address,
                    chainName: chainIdToExplorerInfoChainName[chainId],
                  },
                },
              })
              .then((resp) => resp.data)
            if (data) {
              // eslint-disable-next-line no-param-reassign
              farm.quoteTokenPriceBusd = data.priceUSD
            }
          } catch (error) {
            console.error('Get price from api', error)
          }
        }
      }
      return farm
    }),
  )

  const farmAprs: Record<string, number> = {}
  try {
    const [farmsV2AvgInfo, farmsStableAvgInfo] = await Promise.all([
      fetchV2FarmsAvgInfo(chainId),
      fetchStableFarmsAvgInfo(chainId),
    ])

    const mergedFarmsAvgInfo = { ...farmsV2AvgInfo, ...farmsStableAvgInfo }

    Object.keys(mergedFarmsAvgInfo).forEach((key) => {
      const tokenData = mergedFarmsAvgInfo[key]
      farmAprs[key] = parseFloat(tokenData.apr7d.multipliedBy(100).toFixed(2))
    })
  } catch (e) {
    console.error(e)
  }
  return [farmsWithPriceWithFallback, poolLength, regularCakePerBlock, totalRegularAllocPoint, farmAprs]
}

export const farmFetcher = createFarmFetcher(getViemClients)

const initialState: SerializedFarmsState = {
  data: [],
  chainId: undefined,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  bCakeUserDataLoaded: false,
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
  return getLegacyFarmConfig(chainId).then((farmDataList) => {
    return {
      data:
        farmDataList?.map((farm) => ({
          ...farm,
          userData: {
            allowance: '0',
            tokenBalance: '0',
            stakedBalance: '0',
            earnings: '0',
          },
        })) ?? [],
      chainId,
    }
  })
})

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number, number, string, Record<string, number>],
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

interface BCakeUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  rewardPerSecond: number
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
    fetchFarmUserAllowances(account, farms, chainId),
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

async function getBCakeWrapperFarmsStakeValue(farms, account, chainId) {
  const [
    userFarmAllowances,
    userFarmTokenBalances,
    { parsedStakedBalances: userStakedBalances, boostedAmounts, boosterMultiplier },
    userFarmEarnings,
    { boosterContractAddress, startTimestamp, endTimestamp },
    { rewardPerSec },
  ] = await Promise.all([
    fetchFarmBCakeWrapperUserAllowances(account, farms, chainId),
    fetchFarmUserTokenBalances(account, farms, chainId),
    fetchFarmUserBCakeWrapperStakedBalances(account, farms, chainId),
    fetchFarmUserBCakeWrapperEarnings(account, farms, chainId),
    fetchFarmUserBCakeWrapperConstants(farms, chainId),
    fetchFarmUserBCakeWrapperRewardPerSec(farms, chainId),
  ])

  const normalFarmAllowances = farms.map((_, index) => {
    return {
      pid: farms[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
      boosterMultiplier: boosterMultiplier[index],
      boostedAmounts: boostedAmounts[index],
      boosterContractAddress: boosterContractAddress[index],
      rewardPerSecond: rewardPerSec[index],
      startTimestamp: startTimestamp[index],
      endTimestamp: endTimestamp[index],
    }
  })

  return normalFarmAllowances
}

async function getBCakeWrapperFarmsData(farms, chainId) {
  const [{ boosterContractAddress, startTimestamp, endTimestamp, totalLiquidityX }, { rewardPerSec }] =
    await Promise.all([
      fetchFarmUserBCakeWrapperConstants(farms, chainId),
      fetchFarmUserBCakeWrapperRewardPerSec(farms, chainId),
    ])

  const normalFarmAllowances = farms.map((_, index) => {
    return {
      pid: farms[index].pid,
      boosterContractAddress: boosterContractAddress[index],
      rewardPerSecond: rewardPerSec[index],
      startTimestamp: startTimestamp[index],
      endTimestamp: endTimestamp[index],
      totalLiquidityX: totalLiquidityX[index],
    }
  })

  return normalFarmAllowances
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
    const farmsConfig = await getLegacyFarmConfig(chainId)
    const farmsCanFetch =
      farmsConfig?.filter((farmConfig) => pids.includes(farmConfig.pid) && poolLength > farmConfig.pid) ?? []
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

export const fetchBCakeWrapperUserDataAsync = createAsyncThunk<
  BCakeUserDataResponse[],
  { account: Address; pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchBCakeWrapperUserData',
  async ({ account, chainId, pids }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    const farmsConfig = await getLegacyFarmConfig(chainId)
    const farmsCanFetch = farmsConfig?.filter((farmConfig) => pids.includes(farmConfig.pid)) ?? []
    if (farmsCanFetch?.length) {
      const normalAllowances = await getBCakeWrapperFarmsStakeValue(farmsCanFetch, account, chainId)
      return normalAllowances
    }

    return getBCakeWrapperFarmsStakeValue(farmsCanFetch, account, chainId)
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
        console.debug('farms with BCakeWrapper user action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export const fetchBCakeWrapperDataAsync = createAsyncThunk<
  BCakeUserDataResponse[],
  { pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchBCakeWrapperData',
  async ({ chainId, pids }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    const farmsConfig = await getLegacyFarmConfig(chainId)
    const farmsCanFetch = farmsConfig?.filter((farmConfig) => pids.includes(farmConfig.pid)) ?? []
    if (farmsCanFetch?.length) {
      const normalAllowances = await getBCakeWrapperFarmsData(farmsCanFetch, chainId)
      return normalAllowances
    }

    return getBCakeWrapperFarmsData(farmsCanFetch, chainId)
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
        console.debug('farms with BCakeWrapper is fetching, skipping here')
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
          bCakeUserData: {
            allowance: '0',
            tokenBalance: '0',
            stakedBalance: '0',
            earnings: '0',
            rewardPerSecond: 0,
          },
        }
      })
      state.userDataLoaded = false
      state.bCakeUserDataLoaded = false
    })
    // Init farm data
    builder.addCase(fetchInitialFarmsData.fulfilled, (state, action) => {
      const { data, chainId } = action.payload
      state.data = data
      state.chainId = chainId
    })

    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock, totalRegularAllocPoint, farmAprs] = action.payload
      const farmPayloadPidMap = keyBy(farmPayload, 'pid')

      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayloadPidMap[farm.pid]
        return {
          ...farm,
          ...liveFarmData,
          ...(farmAprs[farm.lpAddress.toLowerCase()] && { lpRewardsApr: farmAprs[farm.lpAddress.toLowerCase()] }),
        }
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
    // Update farms with BCakeWrapper user data
    builder.addCase(fetchBCakeWrapperUserDataAsync.fulfilled, (state, action) => {
      const userDataMap = keyBy(action.payload, 'pid')
      state.data = state.data.map((farm) => {
        const userDataEl = userDataMap[farm.pid]
        if (userDataEl) {
          return { ...farm, bCakeUserData: userDataEl }
        }
        return farm
      })
      state.bCakeUserDataLoaded = true
    })
    builder.addCase(fetchBCakeWrapperDataAsync.fulfilled, (state, action) => {
      const userDataMap = keyBy(action.payload, 'pid')
      state.data = state.data.map((farm) => {
        const userDataEl = userDataMap[farm.pid]
        if (userDataEl) {
          return { ...farm, bCakePublicData: userDataEl }
        }
        return farm
      })
      state.bCakeUserDataLoaded = true
    })

    builder.addMatcher(
      isAnyOf(
        fetchFarmUserDataAsync.pending,
        fetchFarmsPublicDataAsync.pending,
        fetchBCakeWrapperUserDataAsync.pending,
        fetchBCakeWrapperDataAsync.pending,
      ),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
      },
    )
    builder.addMatcher(
      isAnyOf(
        fetchFarmUserDataAsync.fulfilled,
        fetchFarmsPublicDataAsync.fulfilled,
        fetchBCakeWrapperDataAsync.fulfilled,
        fetchBCakeWrapperUserDataAsync.fulfilled,
      ),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(
        fetchFarmsPublicDataAsync.rejected,
        fetchFarmUserDataAsync.rejected,
        fetchBCakeWrapperUserDataAsync.rejected,
        fetchBCakeWrapperDataAsync.rejected,
      ),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default farmsSlice.reducer
