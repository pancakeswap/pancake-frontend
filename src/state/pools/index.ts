import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import {
  PoolsState,
  SerializedPool,
  SerializedVaultFees,
  SerializedCakeVault,
  SerializedLockedVaultUser,
  PublicIfoData,
  SerializedVaultUser,
  SerializedLockedCakeVault,
} from 'state/types'
import { getPoolApr } from 'utils/apr'
import { BIG_ZERO } from 'utils/bigNumber'
import cakeAbi from 'config/abi/cake.json'
import { getCakeVaultAddress, getCakeFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import tokens from 'config/constants/tokens'
import { getBalanceNumber } from 'utils/formatBalance'
import { simpleRpcProvider } from 'utils/providers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import fetchFarms from '../farms/fetchFarms'
import getFarmsPrices from '../farms/getFarmsPrices'
import {
  fetchPoolsBlockLimits,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsTotalStaking,
} from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees, fetchPublicFlexibleSideVaultData } from './fetchVaultPublic'
import { getTokenPricesFromFarm } from './helpers'
import { resetUserState } from '../global/actions'
import { fetchUserIfoCredit, fetchPublicIfoData } from './fetchUserIfo'
import { fetchVaultUser, fetchFlexibleSideVaultUser } from './fetchVaultUser'

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
  data: [...poolsConfig],
  userDataLoaded: false,
  cakeVault: initialPoolVaultState,
  ifo: initialIfoState,
  cakeFlexibleSideVault: initialPoolVaultState,
}

const cakeVaultAddress = getCakeVaultAddress()

export const fetchCakePoolPublicDataAsync = () => async (dispatch, getState) => {
  const farmsData = getState().farms.data
  const prices = getTokenPricesFromFarm(farmsData)

  const cakePool = poolsConfig.filter((p) => p.sousId === 0)[0]

  const stakingTokenAddress = cakePool.stakingToken.address ? cakePool.stakingToken.address.toLowerCase() : null
  const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

  const earningTokenAddress = cakePool.earningToken.address ? cakePool.earningToken.address.toLowerCase() : null
  const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0

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

export const fetchCakePoolUserDataAsync = (account: string) => async (dispatch) => {
  const allowanceCall = {
    address: tokens.cake.address,
    name: 'allowance',
    params: [account, cakeVaultAddress],
  }
  const balanceOfCall = {
    address: tokens.cake.address,
    name: 'balanceOf',
    params: [account],
  }
  const cakeContractCalls = [allowanceCall, balanceOfCall]
  const [[allowance], [stakingTokenBalance]] = await multicallv2(cakeAbi, cakeContractCalls)

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

export const fetchPoolsPublicDataAsync = (currentBlockNumber: number) => async (dispatch, getState) => {
  try {
    const [blockLimits, totalStakings, profileRequirements, currentBlock] = await Promise.all([
      fetchPoolsBlockLimits(),
      fetchPoolsTotalStaking(),
      fetchPoolsProfileRequirement(),
      currentBlockNumber ? Promise.resolve(currentBlockNumber) : simpleRpcProvider.getBlockNumber(),
    ])

    const activePriceHelperLpsConfig = priceHelperLpsConfig.filter((priceHelperLpConfig) => {
      return (
        poolsConfig
          .filter((pool) => pool.earningToken.address.toLowerCase() === priceHelperLpConfig.token.address.toLowerCase())
          .filter((pool) => {
            const poolBlockLimit = blockLimits.find((blockLimit) => blockLimit.sousId === pool.sousId)
            if (poolBlockLimit) {
              return poolBlockLimit.endBlock > currentBlock
            }
            return false
          }).length > 0
      )
    })
    const poolsWithDifferentFarmToken =
      activePriceHelperLpsConfig.length > 0 ? await fetchFarms(priceHelperLpsConfig) : []
    const farmsData = getState().farms.data
    const bnbBusdFarm =
      activePriceHelperLpsConfig.length > 0
        ? farmsData.find((farm) => farm.token.symbol === 'BUSD' && farm.quoteToken.symbol === 'WBNB')
        : null
    const farmsWithPricesOfDifferentTokenPools = bnbBusdFarm
      ? getFarmsPrices([bnbBusdFarm, ...poolsWithDifferentFarmToken])
      : []

    const prices = getTokenPricesFromFarm([...farmsData, ...farmsWithPricesOfDifferentTokenPools])

    const liveData = poolsConfig.map((pool) => {
      const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
      const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
      const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

      const stakingTokenAddress = pool.stakingToken.address ? pool.stakingToken.address.toLowerCase() : null
      const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

      const earningTokenAddress = pool.earningToken.address ? pool.earningToken.address.toLowerCase() : null
      const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
      const apr = !isPoolFinished
        ? getPoolApr(
            stakingTokenPrice,
            earningTokenPrice,
            getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
            parseFloat(pool.tokenPerBlock),
          )
        : 0

      const profileRequirement = profileRequirements[pool.sousId] ? profileRequirements[pool.sousId] : undefined

      return {
        ...blockLimit,
        ...totalStaking,
        profileRequirement,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      }
    })

    dispatch(setPoolsPublicData(liveData))
  } catch (error) {
    console.error('[Pools Action] error when getting public data', error)
  }
}

export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  try {
    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

    const stakingLimitData = poolsConfig.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const { stakingLimit, numberBlocksForUserLimit } = stakingLimits[pool.sousId] || {
        stakingLimit: BIG_ZERO,
        numberBlocksForUserLimit: 0,
      }
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        numberBlocksForUserLimit,
      }
    })

    dispatch(setPoolsPublicData(stakingLimitData))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
      fetchPoolsAllowance(account),
      fetchUserBalances(account),
      fetchUserStakeBalances(account),
      fetchUserPendingRewards(account),
    ])

    const userData = poolsConfig.map((pool) => ({
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
  { sousId: number; account: string }
>('pool/updateUserAllowance', async ({ sousId, account }) => {
  const allowances = await fetchPoolsAllowance(account)
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserBalance', async ({ sousId, account }) => {
  const tokenBalances = await fetchUserBalances(account)
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserStakedBalance', async ({ sousId, account }) => {
  const stakedBalances = await fetchUserStakeBalances(account)
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserPendingReward', async ({ sousId, account }) => {
  const pendingRewards = await fetchUserPendingRewards(account)
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const fetchCakeVaultPublicData = createAsyncThunk<SerializedLockedCakeVault>(
  'cakeVault/fetchPublicData',
  async () => {
    const publicVaultInfo = await fetchPublicVaultData()
    return publicVaultInfo
  },
)

export const fetchCakeFlexibleSideVaultPublicData = createAsyncThunk<SerializedCakeVault>(
  'cakeFlexibleSideVault/fetchPublicData',
  async () => {
    const publicVaultInfo = await fetchPublicFlexibleSideVaultData()
    return publicVaultInfo
  },
)

export const fetchCakeVaultFees = createAsyncThunk<SerializedVaultFees>('cakeVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees(getCakeVaultAddress())
  return vaultFees
})

export const fetchCakeFlexibleSideVaultFees = createAsyncThunk<SerializedVaultFees>(
  'cakeFlexibleSideVault/fetchFees',
  async () => {
    const vaultFees = await fetchVaultFees(getCakeFlexibleSideVaultAddress())
    return vaultFees
  },
)

export const fetchCakeVaultUserData = createAsyncThunk<SerializedLockedVaultUser, { account: string }>(
  'cakeVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)

export const fetchIfoPublicDataAsync = createAsyncThunk<PublicIfoData>('ifoVault/fetchIfoPublicDataAsync', async () => {
  const publicIfoData = await fetchPublicIfoData()
  return publicIfoData
})

export const fetchUserIfoCreditDataAsync = (account: string) => async (dispatch) => {
  try {
    const credit = await fetchUserIfoCredit(account)
    dispatch(setIfoUserCreditData(credit))
  } catch (error) {
    console.error('[Ifo Credit Action] Error fetching user Ifo credit data', error)
  }
}
export const fetchCakeFlexibleSideVaultUserData = createAsyncThunk<SerializedVaultUser, { account: string }>(
  'cakeFlexibleSideVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchFlexibleSideVaultUser(account)
    return userData
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
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
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
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
      state.cakeVault = { ...state.cakeVault, userData: initialPoolVaultState.userData }
      state.cakeFlexibleSideVault = { ...state.cakeFlexibleSideVault, userData: initialPoolVaultState.userData }
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
        state.data = state.data.map((pool) => {
          const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
          return { ...pool, userDataLoaded: true, userData: userPoolData }
        })
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
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { setPoolsPublicData, setPoolPublicData, setPoolUserData, setIfoUserCreditData } = PoolsSlice.actions

export default PoolsSlice.reducer
