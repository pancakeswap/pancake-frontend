import { atom } from 'jotai'
import { extendPoolsAtom } from '../extendPools/atom'
import { farmPoolsAtom } from '../farmPools/atom'
import { ChainIdAddressKey, PoolInfo } from '../type'

export const poolsAtom = atom<PoolInfo[]>((get) => {
  const farmPools = get(farmPoolsAtom)
  const extendPools = get(extendPoolsAtom)

  return farmPools.concat(extendPools)
})

export type PoolAprDetail = {
  lpApr: {
    value: `${number}`
  }
  cakeApr: {
    // default apr
    value: `${number}`
    // apr with boost, not related to user account
    boost?: `${number}`
  }
  // @todo @ChefJerry implement merklApr
  merklApr: {
    value: `${number}`
  }
}

export type PoolApr = Record<ChainIdAddressKey, PoolAprDetail>

export const poolAprAtom = atom({} as PoolApr, (get, set, newValue: PoolApr) => {
  set(poolAprAtom, { ...get(poolAprAtom), ...newValue })
})

export const emptyAprPoolsAtom = atom((get) => {
  const pools = get(poolsAtom)
  const aprs = get(poolAprAtom)

  return pools.filter((pool) => !aprs[`${pool.chainId}:${pool.lpAddress}`])
})
