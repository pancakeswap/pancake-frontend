import { useAccountResources } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import _get from 'lodash/get'

import { SMARTCHEF_ADDRESS, SMARTCHEF_POOL_INFO_TYPE_TAG } from 'contracts/smartchef/constants'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useMasterChefResource } from 'state/farms/hook'

import { transformCakePool, transformPool } from './utils'
import { PoolResource } from './types'

// Philip TODO: optimize
export const usePoolsList = () => {
  const { account } = useActiveWeb3React()

  const { data: pools } = useAccountResources({
    address: SMARTCHEF_ADDRESS,
    select: (resources) => {
      return resources.filter((resource) => resource.type.includes(SMARTCHEF_POOL_INFO_TYPE_TAG))
    },
    watch: true,
  })

  const { data: balances } = useAccountResources({
    address: account,
    select: (resources) => {
      return resources
    },
  })

  const cakePool = useCakePool(balances)

  return useMemo(() => {
    const syrupPools = pools ? pools.map((pool) => transformPool(pool as PoolResource, balances)) : []

    return [cakePool, ...syrupPools]
  }, [pools, balances, cakePool])
}

const CAKE_PID = 2

export const useCakePool = (balances) => {
  const { data: masterChef } = useMasterChefResource()

  return useMemo(() => {
    if (!masterChef) return undefined
    const cakePoolInfo = masterChef.data.pool_info[CAKE_PID]

    return transformCakePool({
      balances,
      cakePoolInfo,
    })
  }, [masterChef, balances])
}
