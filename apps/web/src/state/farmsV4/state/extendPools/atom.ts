import { atom } from 'jotai'
import { isAddressEqual } from 'viem'
import { farmPoolsAtom } from '../farmPools/atom'
import { PoolInfo } from '../type'

export const extendPoolsAtom = atom([] as PoolInfo[], (get, set, values: PoolInfo[]) => {
  // remove duplicates pools with farmPoolsAtom
  const farms = get(farmPoolsAtom)
  const newData = values.filter(
    (pool) => !farms.some((farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.protocol === pool.protocol),
  )

  set(extendPoolsAtom, [...get(extendPoolsAtom), ...newData])
})
