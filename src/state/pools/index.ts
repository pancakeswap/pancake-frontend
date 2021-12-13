import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  PoolsState,
  SerializedPool,
  CakeVault,
  VaultFees,
  VaultUser,
  AppThunk,
  IfoVaultUser,
  IfoCakeVault,
} from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import { fetchIfoPoolFeesData, fetchPublicIfoPoolData } from './fetchIfoPoolPublic'
import fetchVaultUser from './fetchVaultUser'
import fetchIfoPoolUserData from './fetchIfoPoolUser'
import { getTokenPricesFromFarm } from './helpers'

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  pricePerFullShare: null,
  totalCakeInVault: null,
  estimatedCakeBountyReward: null,
  totalPendingCakeHarvest: null,
  fees: {
    performanceFee: null,
    callFee: null,
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
  },
})

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
  cakeVault: initialPoolVaultState,
  ifoPool: initialPoolVaultState,
}

// Thunks
export const fetchPoolsPublicDataAsync = (currentBlock: number) => async (dispatch, getState) => {
  const blockLimits = await fetchPoolsBlockLimits()
  const totalStakings = await fetchPoolsTotalStaking()

  const prices = getTokenPricesFromFarm(getState().farms.data)

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

    return {
      ...blockLimit,
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setPoolsPublicData(liveData))
}

export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

  const stakingLimitData = poolsConfig.map((pool) => {
    if (poolsWithStakingLimit.includes(pool.sousId)) {
      return { sousId: pool.sousId }
    }
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    }
  })

  dispatch(setPoolsPublicData(stakingLimitData))
}

export const fetchPoolsUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    const stakingTokenBalances = await fetchUserBalances(account)
    const stakedBalances = await fetchUserStakeBalances(account)
    const pendingRewards = await fetchUserPendingRewards(account)

    const userData = poolsConfig.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))

    dispatch(setPoolsUserData(userData))
  }

export const updateUserAllowance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateUserBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserStakedBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserPendingReward =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const pendingRewards = await fetchUserPendingRewards(account)
    dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export const fetchCakeVaultPublicData = createAsyncThunk<CakeVault>('cakeVault/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicVaultData()
  return publicVaultInfo
})

export const fetchCakeVaultFees = createAsyncThunk<VaultFees>('cakeVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees()
  return vaultFees
})

export const fetchCakeVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
  'cakeVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)

export const fetchIfoPoolPublicData = createAsyncThunk<IfoCakeVault>('ifoPool/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicIfoPoolData()
  return publicVaultInfo
})

export const fetchIfoPoolFees = createAsyncThunk<VaultFees>('ifoPool/fetchFees', async () => {
  const vaultFees = await fetchIfoPoolFeesData()
  return vaultFees
})

export const fetchIfoPoolUserAndCredit = createAsyncThunk<IfoVaultUser, { account: string }>(
  'ifoPool/fetchUser',
  async ({ account }) => {
    const userData = await fetchIfoPoolUserData(account)
    return userData
  },
)

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
  extraReducers: (builder) => {
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVault>) => {
      state.cakeVault = { ...state.cakeVault, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.cakeVault = { ...state.cakeVault, fees }
    })
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
      const userData = action.payload
      userData.isLoading = false
      state.cakeVault = { ...state.cakeVault, userData }
    })
    // Vault public data that updates frequently
    builder.addCase(fetchIfoPoolPublicData.fulfilled, (state, action) => {
      state.ifoPool = { ...state.ifoPool, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchIfoPoolFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.ifoPool = { ...state.ifoPool, fees }
    })
    // Vault user data
    builder.addCase(fetchIfoPoolUserAndCredit.fulfilled, (state, action) => {
      const userData = action.payload
      userData.isLoading = false
      state.ifoPool = { ...state.ifoPool, userData }
    })
  },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData } = PoolsSlice.actions

export default PoolsSlice.reducer
