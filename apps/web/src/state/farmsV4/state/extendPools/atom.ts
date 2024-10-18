import { ChainId } from '@pancakeswap/chains'
import { Protocol, supportedChainIdV4 } from '@pancakeswap/farms'
import { atom } from 'jotai'
import { isAddressEqual } from 'utils'
import { type Address } from 'viem'
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

export const DEFAULT_QUERIES = {
  protocols: [Protocol.V2, Protocol.V3, Protocol.STABLE],
  orderBy: PoolSortBy.VOL,
  chains: [...supportedChainIdV4],
  pools: [],
  tokens: [],
  before: '',
  after: '',
}

export const extendPoolsQueryAtom = atom<ExtendPoolsQuery>(DEFAULT_QUERIES)

export const extendPoolsAtom = atom([] as PoolInfo[], (get, set, values: PoolInfo[]) => {
  // remove duplicates pools with farmPoolsAtom
  const farms = get(farmPoolsAtom)
  const newData = values.filter(
    (pool) => !farms.some((farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.protocol === pool.protocol),
  )

  set(extendPoolsAtom, [...get(extendPoolsAtom), ...newData])
})

interface PoolsOfPositionType {
  [address: Address]: PoolInfo
}
export const poolsOfPositionAtom = atom({} as PoolsOfPositionType)
