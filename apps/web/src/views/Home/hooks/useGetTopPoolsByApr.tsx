import { useState, useEffect } from 'react'
import { useAppDispatch } from 'state'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { VaultKey } from 'state/types'
import {
  fetchCakeVaultFees,
  fetchPoolsPublicDataAsync,
  fetchCakeVaultPublicData,
  setInitialPoolConfig,
} from 'state/pools'
import { usePoolsWithVault } from 'state/pools/hooks'
import { Pool } from '@pancakeswap/widgets-internal'
import { Token } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'

const useGetTopPoolsByApr = (isIntersecting: boolean, chainId: number) => {
  const dispatch = useAppDispatch()
  const [topPools, setTopPools] = useState<(Pool.DeserializedPool<Token> | any)[]>(() => [null, null, null, null, null])
  const { pools } = usePoolsWithVault()

  const { status: fetchStatus, isFetching } = useQuery(
    [chainId, 'fetchTopPoolsByApr'],
    async () => {
      await dispatch(setInitialPoolConfig({ chainId }))
      return Promise.all([
        dispatch(fetchCakeVaultFees(chainId)),
        dispatch(fetchCakeVaultPublicData(chainId)),
        dispatch(fetchPoolsPublicDataAsync(chainId)),
      ])
    },
    {
      enabled: Boolean(isIntersecting && chainId),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    const [cakePools, otherPools] = partition(pools, (pool) => pool.sousId === 0)
    const masterCakePool = cakePools.filter((cakePool) => cakePool.vaultKey === VaultKey.CakeVault)
    const getTopPoolsByApr = (activePools: (Pool.DeserializedPool<Token> | any)[]) => {
      const sortedByApr = orderBy(activePools, (pool: Pool.DeserializedPool<Token>) => pool.apr || 0, 'desc')
      setTopPools([...masterCakePool, ...sortedByApr.slice(0, 4)])
    }
    if (fetchStatus === 'success' && !isFetching) {
      getTopPoolsByApr(otherPools)
    }
  }, [setTopPools, pools, isFetching, fetchStatus])

  return { topPools }
}

export default useGetTopPoolsByApr
