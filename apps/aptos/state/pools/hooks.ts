import { useAccountResources } from '@pancakeswap/awgmi'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { POOLS_ADDRESS } from './constants'
import { poolsPublicDataSelector, poolsUserDataSelector, transformPool } from './utils'

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
