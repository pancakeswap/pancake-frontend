import { ChainId } from '@pancakeswap/chains'
import { Protocol, supportedChainIdV4 } from '@pancakeswap/farms'
import { atom } from 'jotai'
import { isAddressEqual } from 'viem'
import { farmPoolsAtom } from '../farmPools/atom'
import { ChainIdAddressKey, PoolInfo } from '../type'

export enum PoolSortBy {
  APR = 'apr24h',
  TVL = 'tvlUSD',
  VOL = 'volumeUSD24h',
}

export type ExtendPoolsQuery = {
  protocols?: Protocol[]
  orderBy: PoolSortBy
  chains?: ChainId[]
  pools?: ChainIdAddressKey[]
  tokens?: ChainIdAddressKey[]
  before: string
  after: string
}

export const extendPoolsQueryAtom = atom<ExtendPoolsQuery>({
  protocols: ['v2', 'v3', 'stable'],
  orderBy: PoolSortBy.VOL,
  chains: [...supportedChainIdV4],
  pools: [],
  tokens: [],
  before: '',
  after: '',
})

export const extendPoolsAtom = atom([] as PoolInfo[], (get, set, values: PoolInfo[]) => {
  // remove duplicates pools with farmPoolsAtom
  const farms = get(farmPoolsAtom)
  const newData = values.filter(
    (pool) => !farms.some((farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.protocol === pool.protocol),
  )

  set(extendPoolsAtom, [...get(extendPoolsAtom), ...newData])
})
