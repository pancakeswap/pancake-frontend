import React, { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
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
import { batch } from 'react-redux'
import PoolsTable from './PoolTable'

const NewPool: React.FC = () => {
  const { account } = useWeb3React()
  const { pools } = usePoolsWithVault()
  const cakeVault = useCakeVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  )

  const userDataReady: boolean = !account || (!!account && !cakeVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData())
      dispatch(fetchCakeFlexibleSideVaultPublicData())
      dispatch(fetchCakePoolPublicDataAsync())
      if (account) {
        dispatch(fetchCakeVaultUserData({ account }))
        dispatch(fetchCakeFlexibleSideVaultUserData({ account }))
        dispatch(fetchCakePoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultFees())
      dispatch(fetchCakeFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
