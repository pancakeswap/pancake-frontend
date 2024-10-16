import { ChainId } from '@pancakeswap/chains'
import { Protocol, supportedChainIdV4 } from '@pancakeswap/farms'
import { atom } from 'jotai'
import { isAddressEqual, type Address } from 'viem'
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

export const extendPoolsAtom = atom<PoolInfo[]>([])

export const updateExtendPoolsAtom = atom(null, (get, set, values: PoolInfo[]) => {
  const farms = get(farmPoolsAtom)
  const currentPools = get(extendPoolsAtom)

  const newData = values.filter(
    (pool) => !farms.some((farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.protocol === pool.protocol),
  )

  set(extendPoolsAtom, [...currentPools, ...newData])
})

interface PoolsOfPositionType {
  [address: Address]: PoolInfo
}
export const poolsOfPositionAtom = atom({} as PoolsOfPositionType)
