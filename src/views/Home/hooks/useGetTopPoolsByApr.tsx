import { useState, useEffect, useMemo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { VaultKey, DeserializedPool } from 'state/types'
import { fetchCakeVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { useCakeVault, useIfoPoolCreditBlock, useIfoPoolVault, usePools } from 'state/pools/hooks'
import { getAprData } from 'views/Pools/helpers'

enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export function usePoolsWithVault() {
  const { pools: poolsWithoutAutoVault } = usePools()
  const cakeVault = useCakeVault()
  const ifoPool = useIfoPoolVault()
  const { hasEndBlockOver } = useIfoPoolCreditBlock()
  const pools = useMemo(() => {
    const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
    const cakePool = activePools.find((pool) => pool.sousId === 0)
    const cakeAutoVault = { ...cakePool, vaultKey: VaultKey.CakeVault }
    const ifoPoolVault = { ...cakePool, vaultKey: VaultKey.IfoPool }
    const cakeAutoVaultWithApr = {
      ...cakeAutoVault,
      apr: getAprData(cakeAutoVault, cakeVault.fees.performanceFeeAsDecimal).apr,
      rawApr: cakePool.apr,
    }
    const ifoPoolWithApr = {
      ...ifoPoolVault,
      apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
      rawApr: cakePool.apr,
      isFinished: hasEndBlockOver,
    }
    return [ifoPoolWithApr, cakeAutoVaultWithApr, ...poolsWithoutAutoVault]
  }, [
    poolsWithoutAutoVault,
    cakeVault.fees.performanceFeeAsDecimal,
    ifoPool.fees.performanceFeeAsDecimal,
    hasEndBlockOver,
  ])

  return pools
}

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = usePoolsWithVault()

  const cakePriceBusd = usePriceCakeBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.FETCHING)

      try {
        await dispatch(fetchCakeVaultFees())
        await dispatch(fetchPoolsPublicDataAsync())
        setFetchStatus(FetchStatus.SUCCESS)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.NOT_FETCHED) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting])

  useEffect(() => {
    const getTopPoolsByApr = (activePools: DeserializedPool[]) => {
      const sortedByApr = orderBy(activePools, (pool: DeserializedPool) => pool.apr || 0, 'desc')
      setTopPools(sortedByApr.slice(0, 5))
    }
    if (fetchStatus === FetchStatus.SUCCESS && !topPools[0]) {
      getTopPoolsByApr(pools)
    }
  }, [setTopPools, pools, fetchStatus, cakePriceBusd, topPools])

  return { topPools }
}

export default useGetTopPoolsByApr
