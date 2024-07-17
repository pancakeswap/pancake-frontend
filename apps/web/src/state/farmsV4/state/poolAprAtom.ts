import BigNumber from 'bignumber.js'
import { atom } from 'jotai'
import { publicClient } from 'utils/wagmi'
import { ChainIdAddressKey, PoolInfo } from './type'

export type PoolAprDetail = {
  lpApr: {
    value: `${number}`
  }
  cakeApr: {
    value: `${number}`
  }
  merklApr: {
    value: `${number}`
  }
}

export type PoolApr = Record<ChainIdAddressKey, PoolAprDetail>

export const poolAprAtom = atom<PoolApr>({} as PoolApr)

export const poolAprSetterAtom = atom(null, (get, set, update: PoolApr) => {
  set(poolAprAtom, { ...get(poolAprAtom), ...update })
})

export const calcCakeApr = (pool: PoolInfo) => {
  throw new Error('not implemented')
}

export const calcV3PoolCakeApr = async (pool: PoolInfo & { procotol: 'v3' }, cakePrice: BigNumber) => {
  const { tvlUsd } = pool
  const client = publicClient({ chainId: pool.chainId })
  if (!tvlUsd || !client) {
    return {
      value: '0',
    }
  }
  throw new Error('not implemented')
  // const masterChefV3 = getMasterChefV3Contract(undefined, pool.chainId)
  // @todo @ChefJerry get from contract
}

export const calcV2PoolCakeApr = async (pool: PoolInfo & { procotol: 'v2' | 'stable' }, cakePrice: BigNumber) => {
  throw new Error('not implemented')
}
