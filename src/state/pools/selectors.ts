import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAprData } from 'views/Pools/helpers'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault, transformIfoVault } from './helpers'
import { initialPoolVaultState } from './index'

const selectIfoPool = (state: State) => state.pools.ifoPool

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector(
    (state: State) => ({
      pool: state.pools.data.find((p) => p.sousId === sousId),
      userDataLoaded: state.pools.userDataLoaded,
    }),
    ({ pool, userDataLoaded }) => {
      return { pool: transformPool(pool), userDataLoaded }
    },
  )

export const poolsWithUserDataLoadingSelector = createSelector(
  (state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }),
  ({ pools, userDataLoaded }) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) =>
  createSelector(
    (state: State) => (key ? state.pools[key] : initialPoolVaultState),
    (vault) => (key === VaultKey.CakeVault ? transformVault(vault) : transformIfoVault(vault)),
  )

export const poolsWithVaultSelector = createSelector(
  (state: State) => ({
    serializedPools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
    serializedCakeVault: state.pools.cakeVault,
    serializedIfoPool: state.pools.ifoPool,
  }),
  ({ serializedPools, userDataLoaded, serializedCakeVault, serializedIfoPool }) => {
    const pools = serializedPools.map(transformPool)
    const cakeVault = transformVault(serializedCakeVault)
    const ifoPool = transformIfoVault(serializedIfoPool)
    const activePools = pools.filter((pool) => !pool.isFinished)
    const cakePool = activePools.find((pool) => pool.sousId === 0)
    const cakeAutoVault = {
      ...cakePool,
      ...cakeVault,
      vaultKey: VaultKey.CakeVault,
      userData: { ...cakePool.userData, ...cakeVault.userData },
    }
    const ifoPoolVault = {
      ...cakePool,
      ...ifoPool,
      vaultKey: VaultKey.IfoPool,
      userData: { ...cakePool.userData, ...ifoPool.userData },
    }
    const cakeAutoVaultWithApr = {
      ...cakeAutoVault,
      apr: getAprData(cakeAutoVault, cakeVault.fees.performanceFeeAsDecimal).apr,
      rawApr: cakePool.apr,
    }
    const ifoPoolWithApr = {
      ...ifoPoolVault,
      apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
      rawApr: cakePool.apr,
    }
    return { pools: [ifoPoolWithApr, cakeAutoVaultWithApr, ...pools], userDataLoaded }
  },
)

export const ifoPoolCreditBlockSelector = createSelector([selectIfoPool], (serializedIfoPool) => {
  const { creditStartBlock, creditEndBlock } = serializedIfoPool
  return { creditStartBlock, creditEndBlock }
})

export const ifoPoolCreditSelector = createSelector([selectIfoPool], (serializedIfoPool) => {
  const creditAsString = serializedIfoPool.userData?.credit ?? BIG_ZERO
  return new BigNumber(creditAsString)
})

export const ifoWithAprSelector = createSelector(
  [makeVaultPoolByKey(VaultKey.IfoPool), makePoolWithUserDataLoadingSelector(0)],
  (deserializedIfoPool, poolWithUserData) => {
    const { pool } = poolWithUserData
    const {
      fees: { performanceFeeAsDecimal },
    } = deserializedIfoPool
    const ifoPool = { ...pool }
    ifoPool.vaultKey = VaultKey.IfoPool
    ifoPool.apr = getAprData(ifoPool, performanceFeeAsDecimal).apr
    ifoPool.rawApr = pool.apr
    return { pool: ifoPool }
  },
)
