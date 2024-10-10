import { ChainId } from '@pancakeswap/chains'
import { getFarmsPrices } from '@pancakeswap/farms/farmPrices'
import { fetchPublicIfoData, fetchUserIfoCredit } from '@pancakeswap/ifos'
import {
  fetchFlexibleSideVaultUser,
  fetchPoolsAllowance,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsTimeLimits,
  fetchPoolsTotalStaking,
  fetchPublicFlexibleSideVaultData,
  fetchPublicVaultData,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
  fetchVaultFees,
  fetchVaultUser,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getPoolAprByTokenPerBlock,
  getPoolAprByTokenPerSecond,
  getPoolsConfig,
  isLegacyPool,
} from '@pancakeswap/pools'
import { getCurrencyUsdPrice } from '@pancakeswap/price-api-sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import keyBy from 'lodash/keyBy'
import orderBy from 'lodash/orderBy'

import { getPoolsPriceHelperLpFiles } from 'config/constants/priceHelperLps'
import { getCakePriceFromOracle } from 'hooks/useCakePrice'
import { farmV3ApiFetch } from 'state/farmsV3/hooks'
import {
  PoolsState,
  PublicIfoData,
  SerializedCakeVault,
  SerializedLockedCakeVault,
  SerializedLockedVaultUser,
  SerializedPool,
  SerializedVaultFees,
  SerializedVaultUser,
} from 'state/types'
import { safeGetAddress } from 'utils'
import { fetchTokenAplPrice, isAlpToken } from 'utils/fetchTokenAplPrice'
import { getViemClients } from 'utils/viem'
import { publicClient } from 'utils/wagmi'
import { Address, erc20Abi } from 'viem'

import fetchFarms from '../farms/fetchFarms'
import { nativeStableLpMap } from '../farms/getFarmsPrices'
import { resetUserState } from '../global/actions'
import { getTokenPricesFromFarm } from './helpers'

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  totalLockedAmount: null,
  pricePerFullShare: null,
  totalCakeInVault: null,
  fees: {
    performanceFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    credit: null,
    locked: null,
    lockStartTime: null,
    lockEndTime: null,
    userBoostedShare: null,
    lockedAmount: null,
    currentOverdueFee: null,
    currentPerformanceFee: null,
  },
  creditStartBlock: null,
})

export const initialIfoState = Object.freeze({
  credit: null,
  ceiling: null,
})

const initialState: PoolsState = {
  data: [],
  userDataLoaded: false,
  cakeVault: initialPoolVaultState as any,
  ifo: initialIfoState as any,
  cakeFlexibleSideVault: initialPoolVaultState as any,
}

export const fetchCakePoolPublicDataAsync = () => async (dispatch) => {
  const cakePrice = parseFloat(await getCakePriceFromOracle())

  const stakingTokenPrice = cakePrice
  const earningTokenPrice = cakePrice

  dispatch(
    setPoolPublicData({
      sousId: 0,
      data: {
        stakingTokenPrice,
        earningTokenPrice,
      },
    }),
  )
}

export const fetchCakePoolUserDataAsync =
  ({ account, chainId }: { account: string; chainId: ChainId }) =>
  async (dispatch) => {
    const client = publicClient({ chainId: ChainId.BSC })
    const [allowance, stakingTokenBalance] = await client.multicall({
      contracts: [
        {
          abi: erc20Abi,
          address: bscTokens.cake.address,
          functionName: 'allowance',
          args: [account as Address, getCakeVaultAddress(chainId)],
        },
        {
          abi: erc20Abi,
          address: bscTokens.cake.address,
          functionName: 'balanceOf',
          args: [account as Address],
        },
      ],
      allowFailure: false,
    })

    dispatch(
      setPoolUserData({
        sousId: 0,
        data: {
          allowance: new BigNumber(allowance.toString()).toJSON(),
          stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
        },
      }),
    )
  }

export const fetchPoolsPublicDataAsync = (chainId: number) => async (dispatch, getState) => {
  try {
    const [block, timeLimits] = await Promise.all([
      getViemClients({ chainId })?.getBlock({ blockTag: 'latest' }),
      fetchPoolsTimeLimits(chainId, getViemClients),
    ])
    const timeLimitsSousIdMap = keyBy(timeLimits, 'sousId')
    const priceHelperLpsConfig = getPoolsPriceHelperLpFiles(chainId)
    const poolsConfig = (await getPoolsConfig(chainId)) || []
    const activePriceHelperLpsConfig = priceHelperLpsConfig.filter((priceHelperLpConfig) => {
      return (
        poolsConfig
          .filter((pool) => pool.earningToken.address.toLowerCase() === priceHelperLpConfig.token.address.toLowerCase())
          .filter((pool) => {
            const poolTimeLimit = timeLimitsSousIdMap[pool.sousId]
            if (poolTimeLimit) {
              return poolTimeLimit.endTimestamp > Number(block?.timestamp)
            }
            return false
          }).length > 0
      )
    })

    const fetchFarmV3Promise = farmV3ApiFetch(chainId)
      .then((result) => result?.farmsWithPrice || [])
      .catch(() => {
        return []
      })

    const [totalStakings, profileRequirements, poolsWithDifferentFarmToken, farmsV3Data] = await Promise.all([
      fetchPoolsTotalStaking(chainId, getViemClients),
      fetchPoolsProfileRequirement(chainId, getViemClients),
      activePriceHelperLpsConfig.length > 0 ? fetchFarms(priceHelperLpsConfig, chainId) : Promise.resolve([]),
      fetchFarmV3Promise,
    ])

    const totalStakingsSousIdMap = keyBy(totalStakings, 'sousId')

    const farmsV2Data = getState().farms.data
    const bnbBusdFarms =
      activePriceHelperLpsConfig.length > 0
        ? [...orderBy(farmsV3Data, 'lmPoolLiquidity', 'desc'), ...farmsV2Data].filter(
            (farm) => farm.token.symbol === 'BUSD' && farm.quoteToken.symbol === 'WBNB',
          )
        : []
    const farmsWithPricesOfDifferentTokenPools =
      bnbBusdFarms.length > 0
        ? getFarmsPrices([...bnbBusdFarms, ...poolsWithDifferentFarmToken], nativeStableLpMap[chainId], 18)
        : []

    const prices = getTokenPricesFromFarm([...farmsV2Data, ...farmsV3Data, ...farmsWithPricesOfDifferentTokenPools])

    const liveData: any[] = []

    for (const pool of poolsConfig) {
      const timeLimit = timeLimitsSousIdMap[pool.sousId]
      const totalStaking = totalStakingsSousIdMap[pool.sousId]
      const isPoolEndBlockExceeded =
        block.timestamp > 0 && timeLimit ? block.timestamp > Number(timeLimit.endTimestamp) : false
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

      const stakingTokenAddress = safeGetAddress(pool.stakingToken.address)
      let stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0
      if (stakingTokenAddress && !prices[stakingTokenAddress] && !isPoolFinished) {
        // TODO: Remove this when fetchTokenUSDValue can get APL USD Price
        const isAlpTokenValid = isAlpToken({ chainId, tokenAddress: stakingTokenAddress })
        if (isAlpTokenValid) {
          // eslint-disable-next-line no-await-in-loop
          stakingTokenPrice = await fetchTokenAplPrice()
        } else {
          // eslint-disable-next-line no-await-in-loop
          stakingTokenPrice = await getCurrencyUsdPrice({ chainId, address: stakingTokenAddress })
        }
      }

      const earningTokenAddress = safeGetAddress(pool.earningToken.address)
      let earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
      if (earningTokenAddress && !prices[earningTokenAddress] && !isPoolFinished) {
        // eslint-disable-next-line no-await-in-loop
        earningTokenPrice = await getCurrencyUsdPrice({ chainId, address: earningTokenAddress })
      }
      const totalStaked = getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals)
      const apr = !isPoolFinished
        ? isLegacyPool(pool)
          ? getPoolAprByTokenPerBlock(stakingTokenPrice, earningTokenPrice, totalStaked, parseFloat(pool.tokenPerBlock))
          : getPoolAprByTokenPerSecond(
              stakingTokenPrice,
              earningTokenPrice,
              totalStaked,
              parseFloat(pool.tokenPerSecond),
            )
        : 0

      const profileRequirement = profileRequirements[pool.sousId] ? profileRequirements[pool.sousId] : undefined

      liveData.push({
        ...timeLimit,
        ...totalStaking,
        profileRequirement,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      })
    }

    dispatch(setPoolsPublicData(liveData || []))
  } catch (error) {
    console.error('[Pools Action] error when getting public data', error)
  }
}

export const fetchPoolsStakingLimitsAsync = (chainId: ChainId) => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  try {
    const stakingLimits = await fetchPoolsStakingLimits({ poolsWithStakingLimit, chainId, provider: getViemClients })

    const poolsConfig = await getPoolsConfig(chainId)
    const stakingLimitData = poolsConfig?.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const { stakingLimit, numberSecondsForUserLimit } = stakingLimits[pool.sousId] || {
        stakingLimit: BIG_ZERO,
        numberSecondsForUserLimit: 0,
      }
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        numberSecondsForUserLimit,
      }
    })
    if (stakingLimitData) {
      dispatch(setPoolsPublicData(stakingLimitData))
    }
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  {
    account: string
    chainId: ChainId
  }
>('pool/fetchPoolsUserData', async ({ account, chainId }: any, { rejectWithValue }: any) => {
  try {
    const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
      fetchPoolsAllowance({ account, chainId, provider: getViemClients }),
      fetchUserBalances({ account, chainId, provider: getViemClients }),
      fetchUserStakeBalances({ account, chainId, provider: getViemClients }),
      fetchUserPendingRewards({ account, chainId, provider: getViemClients }),
    ])

    const poolsConfig = await getPoolsConfig(chainId)
    const userData = poolsConfig?.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateUserAllowance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserAllowance', async ({ sousId, account, chainId }) => {
  const allowances = await fetchPoolsAllowance({ account, chainId, provider: getViemClients })
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserBalance', async ({ sousId, account, chainId }) => {
  const tokenBalances = await fetchUserBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserStakedBalance', async ({ sousId, account, chainId }) => {
  const stakedBalances = await fetchUserStakeBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserPendingReward', async ({ sousId, account, chainId }) => {
  const pendingRewards = await fetchUserPendingRewards({ chainId, account, provider: getViemClients })
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const fetchCakeVaultPublicData = createAsyncThunk<SerializedLockedCakeVault, ChainId>(
  'cakeVault/fetchPublicData',
  async (chainId: any): Promise<any> => {
    const publicVaultInfo = await fetchPublicVaultData({ chainId, provider: getViemClients })
    return publicVaultInfo
  },
)

export const fetchCakeFlexibleSideVaultPublicData = createAsyncThunk<SerializedCakeVault, ChainId>(
  'cakeFlexibleSideVault/fetchPublicData',
  async (chainId: any): Promise<any> => {
    const publicVaultInfo = await fetchPublicFlexibleSideVaultData({ chainId, provider: getViemClients })
    return publicVaultInfo
  },
)

export const fetchCakeVaultFees = createAsyncThunk<SerializedVaultFees, ChainId>(
  'cakeVault/fetchFees',
  async (chainId: any): Promise<any> => {
    const vaultFees = await fetchVaultFees({
      chainId,
      provider: getViemClients,
      cakeVaultAddress: getCakeVaultAddress(chainId),
    })
    return vaultFees
  },
)

export const fetchCakeFlexibleSideVaultFees = createAsyncThunk<SerializedVaultFees, ChainId>(
  'cakeFlexibleSideVault/fetchFees',
  async (chainId: any): Promise<any> => {
    const vaultFees = await fetchVaultFees({
      chainId,
      provider: getViemClients,
      cakeVaultAddress: getCakeFlexibleSideVaultAddress(chainId),
    })
    return vaultFees
  },
)

export const fetchCakeVaultUserData = createAsyncThunk<
  SerializedLockedVaultUser,
  { account: Address; chainId: ChainId }
>('cakeVault/fetchUser', async ({ account, chainId }) => {
  const userData = await fetchVaultUser({ account, chainId, provider: getViemClients })
  return userData
})

export const fetchIfoPublicDataAsync = createAsyncThunk<PublicIfoData, ChainId>(
  'ifoVault/fetchIfoPublicDataAsync',
  async (chainId) => {
    const publicIfoData = await fetchPublicIfoData(chainId, getViemClients)
    return publicIfoData
  },
)

export const fetchUserIfoCreditDataAsync =
  ({ account, chainId }: { account: Address; chainId: ChainId }) =>
  async (dispatch) => {
    try {
      const credit = await fetchUserIfoCredit({ account, chainId, provider: getViemClients })
      dispatch(setIfoUserCreditData(credit))
    } catch (error) {
      console.error('[Ifo Credit Action] Error fetching user Ifo credit data', error)
    }
  }
export const fetchCakeFlexibleSideVaultUserData = createAsyncThunk<
  SerializedVaultUser,
  { account: Address; chainId: ChainId }
>('cakeFlexibleSideVault/fetchUser', async ({ account, chainId }) => {
  const userData = await fetchFlexibleSideVaultUser({ chainId, account, provider: getViemClients })
  return userData
})

export const fetchPoolsConfigAsync = createAsyncThunk(
  'pool/fetchPoolsConfigAsync',
  async ({ chainId }: { chainId: number }) => {
    const poolsConfig = await getPoolsConfig(chainId)
    return poolsConfig || []
  },
)

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolPublicData: (state, action) => {
      const { sousId } = action.payload
      const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
      state.data[poolIndex] = {
        ...state.data[poolIndex],
        ...action.payload.data,
      }
    },
    setPoolUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = keyBy(livePoolsData, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
    },
    // IFO
    setIfoUserCreditData: (state, action) => {
      const credit = action.payload
      state.ifo = { ...state.ifo, credit }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPoolsConfigAsync.fulfilled, (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = false
      state.cakeVault = initialPoolVaultState as any
      state.ifo = initialIfoState as any
      state.cakeFlexibleSideVault = initialPoolVaultState as any
    })
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
      state.cakeVault = { ...state.cakeVault, userData: initialPoolVaultState.userData as any }
      state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, userData: initialPoolVaultState.userData as any }
    })
    builder.addCase(
      fetchPoolsUserDataAsync.fulfilled,
      (
        state,
        action: PayloadAction<
          { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[]
        >,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = keyBy(userData, 'sousId')
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[pool.sousId],
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchPoolsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<SerializedLockedCakeVault>) => {
      state.cakeVault = { ...state.cakeVault, ...action.payload }
    })
    builder.addCase(
      fetchCakeFlexibleSideVaultPublicData.fulfilled,
      (state, action: PayloadAction<SerializedCakeVault>) => {
        state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, ...action.payload }
      },
    )
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.cakeVault = { ...state.cakeVault, fees }
    })
    builder.addCase(fetchCakeFlexibleSideVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, fees }
    })
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<SerializedLockedVaultUser>) => {
      const userData = action.payload
      state.cakeVault = { ...state.cakeVault, userData }
    })
    // IFO
    builder.addCase(fetchIfoPublicDataAsync.fulfilled, (state, action: PayloadAction<PublicIfoData>) => {
      const { ceiling } = action.payload
      state.ifo = { ...state.ifo, ceiling }
    })
    builder.addCase(
      fetchCakeFlexibleSideVaultUserData.fulfilled,
      (state, action: PayloadAction<SerializedVaultUser>) => {
        const userData = action.payload
        state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, userData }
      },
    )
    builder.addMatcher(
      isAnyOf(
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action: PayloadAction<{ sousId: number; field: string; value: any }>) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => p.sousId === sousId)

        if (index >= 0) {
          state.data[index] = {
            ...state.data[index],
            userData: { ...state.data[index].userData, [field]: value } as any,
          }
        }
      },
    )
  },
})

// Actions
export const { setPoolsPublicData, setPoolPublicData, setPoolUserData, setIfoUserCreditData } = PoolsSlice.actions

export default PoolsSlice.reducer
