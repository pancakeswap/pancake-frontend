import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useAccountResources, useProvider } from '@pancakeswap/awgmi'
import { fetchPoolsResource } from './fetchPools'
import { transformPools, poolsUserDataSelector } from './utils'
import { poolsStateAtom, poolsListAtom, poolsUserDataLoaded, fetchPoolListAction, setUserDataAction } from './index'
import { useActiveChainId } from '../../hooks/useNetwork'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { PoolSyrupUserResource } from './types'

export const usePoolsState = () => {
  return useAtomValue(poolsStateAtom)
}

export const useDisPatchPoolsState = () => {
  return useSetAtom(poolsStateAtom)
}

export const usePoolsList = () => {
  return useAtomValue(poolsListAtom)
}

export const usePoolsUserDataLoaded = () => {
  return useAtomValue(poolsUserDataLoaded)
}

export const usePoolsPageFetch = () => {
  const dispatch = useDisPatchPoolsState()
  const provider = useProvider()
  const chainId = useActiveChainId()
  const { account } = useActiveWeb3React()
  const { data } = useAccountResources({
    address: account,
    select: poolsUserDataSelector,
    watch: true,
  })

  useEffect(() => {
    const stakingMap = data ?? {}
    const init = async () => {
      const resources = await fetchPoolsResource(provider)
      const pools = await transformPools(resources, chainId)
      dispatch(fetchPoolListAction(pools))
      dispatch(setUserDataAction(stakingMap as Record<string, PoolSyrupUserResource>))
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, data])
}
