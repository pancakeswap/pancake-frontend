import { atom } from 'jotai'
import { PoolInfo } from '../type'

export const farmPoolsAtom = atom<PoolInfo[]>([])

export const updateFarmPoolAtom = atom(null, (get, set, newPool: PoolInfo) => {
  const pools = get(farmPoolsAtom)
  const updatedPools = pools.map((pool) => {
    const isMatchingPool = newPool.stableSwapAddress
      ? pool.chainId === newPool.chainId &&
        pool.lpAddress === newPool.lpAddress &&
        pool.stableSwapAddress === newPool.stableSwapAddress
      : pool.chainId === newPool.chainId && pool.lpAddress === newPool.lpAddress
    if (isMatchingPool) {
      return newPool
    }
    return pool
  })

  set(farmPoolsAtom, updatedPools)
})
