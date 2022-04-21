import { getAprData } from 'views/Pools/helpers'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformLockedVault } from './helpers'
import { initialPoolVaultState } from './index'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformLockedVault(vault))

export const poolsWithVaultSelector = createSelector(
  [poolsWithUserDataLoadingSelector, makeVaultPoolByKey(VaultKey.CakeVault)],
  (poolsWithUserDataLoading, deserializedCakeVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const cakePool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutCakePool = pools.filter((pool) => pool.sousId !== 0)

    const cakeAutoVault = {
      ...cakePool,
      ...deserializedCakeVault,
      vaultKey: VaultKey.CakeVault,
      userData: { ...cakePool.userData, ...deserializedCakeVault.userData },
    }

    const cakeAutoVaultWithApr = {
      ...cakeAutoVault,
      apr: getAprData(cakeAutoVault, deserializedCakeVault.fees.performanceFeeAsDecimal).apr,
      rawApr: cakePool.apr,
    }
    return { pools: [cakeAutoVaultWithApr, ...withoutCakePool], userDataLoaded }
  },
)
