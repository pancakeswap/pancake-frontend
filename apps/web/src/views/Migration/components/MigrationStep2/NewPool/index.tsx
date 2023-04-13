import React, { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useCakeVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchCakePoolUserDataAsync,
  fetchCakeVaultFees,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakePoolPublicDataAsync,
  fetchCakeFlexibleSideVaultPublicData,
  fetchCakeFlexibleSideVaultUserData,
  fetchCakeFlexibleSideVaultFees,
} from 'state/pools'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch } from 'react-redux'

import PoolsTable from './PoolTable'

const NewPool: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { pools } = usePoolsWithVault()
  const cakeVault = useCakeVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  ) as Pool.DeserializedPool<Token>[]

  const userDataReady: boolean = !account || (!!account && !cakeVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchCakeVaultPublicData(chainId))
        dispatch(fetchCakeFlexibleSideVaultPublicData(chainId))
        dispatch(fetchCakePoolPublicDataAsync())
        if (account) {
          dispatch(fetchCakeVaultUserData({ account, chainId }))
          dispatch(fetchCakeFlexibleSideVaultUserData({ account, chainId }))
          dispatch(fetchCakePoolUserDataAsync({ account, chainId }))
        }
      })
    }
  }, [account, dispatch, chainId])

  useEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchCakeVaultFees(chainId))
        dispatch(fetchCakeFlexibleSideVaultFees(chainId))
      })
    }
  }, [dispatch, chainId])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
