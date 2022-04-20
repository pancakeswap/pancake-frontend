import { useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import PoolsTable from './PoolTable'

const NewPool: React.FC = () => {
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePoolsWithVault()
  const userDataReady: boolean = !account || (!!account && userDataLoaded)
  usePoolsPageFetch()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  )

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
