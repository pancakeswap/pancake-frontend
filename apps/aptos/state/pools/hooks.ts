import { useAccountResources } from '@pancakeswap/awgmi'
import { useCallback, useMemo } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { POOLS_ADDRESS } from './constants'
import { Pool } from './types'
import { poolsPublicDataSelector, poolsUserDataSelector, transformPool, getSyrupUserAddress } from './utils'

export const usePoolsList = () => {
  return useAccountResources({
    address: POOLS_ADDRESS,
    select: (r) => {
      return r.filter(poolsPublicDataSelector).map(transformPool)
    },
    watch: true,
  })
}

export const usePoolsUserData = () => {
  const { account } = useActiveWeb3React()
  return useAccountResources({
    address: account,
    select: poolsUserDataSelector,
    watch: true,
  })
}
export const usePoolUserData = (pool: Pool) => {
  const key = useMemo(() => getSyrupUserAddress(pool), [pool])
  const { account } = useActiveWeb3React()
  return useAccountResources({
    address: account,
    select: useCallback((r) => poolsUserDataSelector(r)[key], [key]),
    watch: true,
  })
}

export const usePoolsPageFetch = () => {
  const { account } = useActiveWeb3React()
  const { data: userData } = useAccountResources({
    address: account,
    select: poolsUserDataSelector,
    watch: true,
  })

  const { data: poolData } = useAccountResources({
    address: POOLS_ADDRESS,
    select: (r) => r.filter(poolsPublicDataSelector).map(transformPool),
    watch: true,
  })

  return {
    userData,
    poolData,
  }
}
