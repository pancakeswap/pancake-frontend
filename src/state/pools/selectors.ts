import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAprData } from 'views/Pools/helpers'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey, SerializedIfoCakeVault } from '../types'
import { transformPool, transformVault, transformIfoVault } from './helpers'
import { initialPoolVaultState } from './index'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectCakeVault = (state: State) => state.pools.cakeVault
const selectIfoPool = (state: State) => state.pools.ifoPool
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

export const makeVaultPoolByKey = (key) =>
  createSelector([selectVault(key)], (vault) =>
    key === VaultKey.CakeVault ? transformVault(vault) : transformIfoVault(vault as SerializedIfoCakeVault),
  )

export const poolsWithVaultSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded, selectCakeVault, selectIfoPool],
  (serializedPools, userDataLoaded, serializedCakeVault, serializedIfoPool) => {
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
