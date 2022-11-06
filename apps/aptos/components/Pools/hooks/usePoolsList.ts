import { useAccountResources, useTableItem } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import _get from 'lodash/get'
import _toString from 'lodash/toString'

import { SMARTCHEF_ADDRESS, SMARTCHEF_POOL_INFO_TYPE_TAG } from 'contracts/smartchef/constants'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useMasterChefResource } from 'state/farms/hook'
import { FARMS_USER_INFO, FARMS_USER_INFO_RESOURCE } from 'state/farms/constants'
import { getFarmConfig } from 'config/constants/farms'
import { usePairs } from 'hooks/usePairs'
import { APT, L0_USDC } from 'config/coins'
import { deserializeToken } from '@pancakeswap/token-lists'

import { CAKE_PID } from '../constants'
import { transformCakePool, transformPool } from '../utils'
import { PoolResource } from '../types'

export const usePoolsList = () => {
  const { account, chainId } = useActiveWeb3React()

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
    watch: true,
  })

  const cakePool = useCakePool({ balances, chainId })

  return useMemo(() => {
    const syrupPools = pools ? pools.map((pool) => transformPool(pool as PoolResource, balances)) : []

    return cakePool ? [cakePool, ...syrupPools] : syrupPools
  }, [pools, balances, cakePool])
}

export const useCakePool = ({ balances, chainId }) => {
  const cakeFarm = useMemo(() => getFarmConfig(chainId).find((f) => f.pid === CAKE_PID), [chainId])

  const [[, stablePair], [, cakePair]] = usePairs([
    [APT[chainId], L0_USDC[chainId]],
    cakeFarm?.token ? [APT[chainId], deserializeToken(cakeFarm?.token)] : [],
  ])

  const aptUSD = stablePair?.priceOf(APT[chainId])
  const cakeVsApt = cakePair?.priceOf(deserializeToken(cakeFarm?.token))

  const earningTokenPrice = cakeVsApt?.multiply(aptUSD).toSignificant()

  const { data: masterChef } = useMasterChefResource()

  const poolUserInfo = balances?.find((balance) => balance.type.includes(FARMS_USER_INFO_RESOURCE))

  const poolUserInfoHandle = poolUserInfo?.data?.pid_to_user_info?.inner?.handle

  const { data: userInfo } = useTableItem({
    handle: poolUserInfoHandle,
    data: {
      key: _toString(CAKE_PID),
      keyType: 'u64',
      valueType: FARMS_USER_INFO,
    },
  })

  return useMemo(() => {
    if (!masterChef || !cakeFarm) return undefined
    const cakePoolInfo = masterChef.data.pool_info[CAKE_PID]

    return transformCakePool({
      balances,
      cakePoolInfo,
      userInfo,
      masterChefData: masterChef.data,
      cakeFarm,
      chainId,
      earningTokenPrice,
    })
  }, [masterChef, cakeFarm, balances, userInfo, chainId, earningTokenPrice])
}
