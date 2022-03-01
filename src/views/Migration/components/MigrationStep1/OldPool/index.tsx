import React, { useMemo } from 'react'
import partition from 'lodash/partition'
import { useWeb3React } from '@web3-react/core'
import {
  useFetchPublicPoolsData,
  usePools,
  useFetchUserPools,
  useFetchCakeVault,
  useFetchIfoPool,
  useVaultPools,
} from 'state/pools/hooks'
import { usePoolsWithVault } from 'views/Home/hooks/useGetTopPoolsByApr'
import PoolsTable from './PoolTable'

const OldPool: React.FC = () => {
  const { account } = useWeb3React()
  const { userDataLoaded } = usePools()
  const userDataReady: boolean = !account || (!!account && userDataLoaded)
  const pools = usePoolsWithVault()
  const vaultPools = useVaultPools()

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const OnlyCakePools = useMemo(
    () =>
      openPools.filter((pool) => {
        return pool.userData && pool.sousId === 0
      }),
    [openPools, vaultPools],
  )

  useFetchCakeVault()
  useFetchIfoPool(false)
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  return <PoolsTable pools={OnlyCakePools} account={account} userDataReady={userDataReady} />
}

export default OldPool
