import { atom } from 'jotai'
import { extendPoolsAtom } from './state/extendPools/atom'
import { farmPoolsAtom } from './state/farmPools/atom'
import { PoolInfo } from './state/type'

export const poolsAtom = atom<PoolInfo[]>((get) => {
  const farmPools = get(farmPoolsAtom)
  const extendPools = get(extendPoolsAtom)

  return farmPools.concat(extendPools)
})
