import { useState, useEffect, useMemo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { FetchStatus } from 'config/constants/types'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { DeserializedPool } from 'state/types'
import { fetchCakeVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { simpleRpcProvider } from 'utils/providers'
import { useCakeVault, usePools } from 'state/pools/hooks'
import { getAprData } from 'views/Pools/helpers'

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { pools: poolsWithoutAutoVault } = usePools()
  const {
    fees: { performanceFee },
  } = useCakeVault()
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.INITIAL)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = useMemo(() => {
    const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
    const cakePool = activePools.find((pool) => pool.sousId === 0)
    const cakeAutoVault = { ...cakePool, isAutoVault: true }
    const cakeAutoVaultWithApr = { ...cakeAutoVault, apr: getAprData(cakeAutoVault, performanceFeeAsDecimal).apr }
    return [cakeAutoVaultWithApr, ...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault, performanceFeeAsDecimal])

  const cakePriceBusd = usePriceCakeBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.FETCHING)
      const blockNumber = await simpleRpcProvider.getBlockNumber()

      try {
        await dispatch(fetchCakeVaultFees())
        await dispatch(fetchPoolsPublicDataAsync(blockNumber))
        setFetchStatus(FetchStatus.FETCHED)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.INITIAL) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting])

  useEffect(() => {
    const getTopPoolsByApr = (activePools: DeserializedPool[]) => {
      const sortedByApr = orderBy(activePools, (pool: DeserializedPool) => pool.apr || 0, 'desc')
      setTopPools(sortedByApr.slice(0, 5))
    }
    if (fetchStatus === FetchStatus.FETCHED && !topPools[0]) {
      getTopPoolsByApr(pools)
    }
  }, [setTopPools, pools, fetchStatus, cakePriceBusd, topPools, performanceFeeAsDecimal])

  return { topPools }
}

export default useGetTopPoolsByApr
