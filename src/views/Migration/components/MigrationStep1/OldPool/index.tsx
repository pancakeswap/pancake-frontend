import React, { useMemo } from 'react'
import partition from 'lodash/partition'
import { useWeb3React } from '@web3-react/core'
// import {
//   useFetchPublicPoolsData,
//   usePools,
//   useFetchUserPools,
//   useFetchCakeVault,
//   useFetchIfoPool,
// } from 'state/pools/hooks'
// import { usePoolsWithVault } from 'views/Home/hooks/useGetTopPoolsByApr'

import { useFetchIfoPool } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'
import { useFetchCakeVault } from 'views/Migration/hook/V1/Pool/useFetchCakeVault'
import { useFetchPublicPoolsData } from 'views/Migration/hook/V1/Pool/useFetchPublicPoolsData'
import { useFetchUserPools } from 'views/Migration/hook/V1/Pool/useFetchUserPools'
import PoolsTable from './PoolTable'
import { VaultKey } from 'state/types'

const OldPool: React.FC = () => {
  const { account } = useWeb3React()
  // const { userDataLoaded } = usePools()
  // const pools = usePoolsWithVault()
  // useFetchCakeVault()
  // useFetchIfoPool(false)
  // useFetchPublicPoolsData()
  // useFetchUserPools(account)

  const ifoData = useFetchIfoPool()
  const cakeVault = useFetchCakeVault()
  useFetchPublicPoolsData()
  const { data: poolsWithoutAutoVault, userDataLoaded } = useFetchUserPools(account)

  const usePoolsWithVault = () => {
    const pools = useMemo(() => {
      const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
      const cakePool = activePools.find((pool) => pool.sousId === 0)
      const ifoPoolVault = { ...cakePool, vaultKey: VaultKey.IfoPool }
      const cakeAutoVault = { ...cakePool, vaultKey: VaultKey.CakeVault }

      return [ifoPoolVault, cakeAutoVault, ...poolsWithoutAutoVault]
    }, [poolsWithoutAutoVault, cakeVault.fees.performanceFeeAsDecimal, ifoData.fees.performanceFeeAsDecimal])

    return pools
  }

  const pools = usePoolsWithVault()

  const userDataReady: boolean = !account || (!!account && userDataLoaded)
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const OnlyCakePools = useMemo(
    () =>
      openPools.filter((pool) => {
        return pool.userData && pool.sousId === 0
      }),
    [openPools],
  )

  return <>123</>
  // return <PoolsTable pools={OnlyCakePools} account={account} userDataReady={userDataReady} />
}

export default OldPool
