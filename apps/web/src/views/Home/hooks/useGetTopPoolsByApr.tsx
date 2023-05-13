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
import { FetchStatus } from 'config/constants/types'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import useSWR from 'swr'

const useGetTopPoolsByApr = (isIntersecting: boolean, chainId: number) => {
  const dispatch = useAppDispatch()
  const [topPools, setTopPools] = useState<Pool.DeserializedPool<Token>[]>(() => [null, null, null, null, null])
  const { pools } = usePoolsWithVault()

  const { status: fetchStatus, isValidating } = useSWR(
    isIntersecting && chainId && [chainId, 'fetchTopPoolsByApr'],
    async () => {
      await dispatch(setInitialPoolConfig({ chainId }))
      return Promise.all([
        dispatch(fetchCakeVaultFees(chainId)),
        dispatch(fetchCakeVaultPublicData(chainId)),
        dispatch(fetchPoolsPublicDataAsync(chainId)),
      ])
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  useEffect(() => {
    const [cakePools, otherPools] = partition(pools, (pool) => pool.sousId === 0)
    const masterCakePool = cakePools.filter((cakePool) => cakePool.vaultKey === VaultKey.CakeVault)
    const getTopPoolsByApr = (activePools: Pool.DeserializedPool<Token>[]) => {
      const sortedByApr = orderBy(activePools, (pool: Pool.DeserializedPool<Token>) => pool.apr || 0, 'desc')
      setTopPools([...masterCakePool, ...sortedByApr.slice(0, 4)])
    }
    if (fetchStatus === FetchStatus.Fetched && !isValidating) {
      getTopPoolsByApr(otherPools)
    }
  }, [setTopPools, pools, isValidating, fetchStatus])

  return { topPools }
}

export default useGetTopPoolsByApr
