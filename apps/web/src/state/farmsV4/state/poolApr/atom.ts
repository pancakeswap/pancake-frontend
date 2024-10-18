import type { BigNumber } from 'bignumber.js'
import { atom } from 'jotai'
import { extendPoolsAtom } from '../extendPools/atom'
import { farmPoolsAtom } from '../farmPools/atom'
import { ChainIdAddressKey, PoolInfo } from '../type'

export const poolsAtom = atom<PoolInfo[]>((get) => {
  const farmPools = get(farmPoolsAtom)
  const extendPools = get(extendPoolsAtom)

  return farmPools.concat(extendPools)
})

export type AprValue = {
  [key: ChainIdAddressKey]: `${number}`
}
export type MerklApr = AprValue
export const merklAprAtom = atom<MerklApr>({})

export type LpApr = AprValue
export const lpAprAtom = atom<LpApr>((get) => {
  const pools = get(poolsAtom)
  return pools.reduce((acc, pool) => {
    // eslint-disable-next-line no-param-reassign
    acc[`${pool.chainId}:${pool.lpAddress}`] = pool.lpApr ?? '0'
    return acc
  }, {} as LpApr)
})

export type CakeApr = Record<
  ChainIdAddressKey,
  {
    // default apr
    value: `${number}`
    // boost apr
    boost?: `${number}`
    poolWeight?: BigNumber
    cakePerYear?: BigNumber
    userTvlUsd?: BigNumber
    totalSupply?: bigint
  }
>
export const cakeAprAtom = atom<CakeApr>({})

export const cakeAprSetterAtom = atom(null, (get, set, newApr: CakeApr) => {
  const cakeApr = get(cakeAprAtom)
  set(cakeAprAtom, { ...cakeApr, ...newApr })
})

export type PoolApr = Record<
  ChainIdAddressKey,
  {
    lpApr: `${number}`
    cakeApr: CakeApr[ChainIdAddressKey]
    merklApr: `${number}`
  }
>

export const poolAprAtom = atom<PoolApr>((get) => {
  const lpAprs = get(lpAprAtom)
  const cakeAprs = get(cakeAprAtom)
  const merklAprs = get(merklAprAtom)

  return Object.entries(lpAprs).reduce((acc, [key, lpApr]) => {
    // eslint-disable-next-line no-param-reassign
    acc[key] = {
      lpApr,
      cakeApr: cakeAprs[key],
      merklApr: merklAprs[key],
    }
    return acc
  }, {} as PoolApr)
})

export const emptyCakeAprPoolsAtom = atom((get) => {
  const pools = get(poolsAtom)
  const aprs = get(cakeAprAtom)

  return pools.filter((pool) => !(`${pool.chainId}:${pool.lpAddress}` in aprs))
})
