import React, { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import { fetchCakeVaultFees, fetchCakeVaultPublicData, fetchCakeVaultUserData } from 'state/pools'
import PoolsTable from './PoolTable'

const NewPool: React.FC = () => {
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePoolsWithVault()
  const userDataReady: boolean = !account || (!!account && userDataLoaded)
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    dispatch(fetchCakeVaultPublicData())
    if (account) {
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }, [account, dispatch])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  )

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
