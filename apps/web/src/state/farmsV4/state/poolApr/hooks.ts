import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { extendPoolsAtom } from '../extendPools/atom'
import { fetchExplorerPoolInfo } from '../extendPools/fetcher'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { cakeAprSetterAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom, poolsAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr, getLpApr } from './fetcher'

export const usePoolApr = (key: ChainIdAddressKey) => {
  const pool = useAtomValue(poolsAtom)[key]
  const updatePools = useSetAtom(extendPoolsAtom)
  const updateCallback = useCallback(async () => {
    if (!pool) {
      const [chainId, poolAddress] = key.split(':')
      const poolInfo = await fetchExplorerPoolInfo(poolAddress, Number(chainId))
      if (poolInfo) {
        const lpApr = await getLpApr(poolInfo)
        poolInfo.lpApr = `${lpApr}`
        updatePools([poolInfo])
      }
    }
  }, [key, pool, updatePools])

  useQuery({
    queryKey: ['apr', key],
    queryFn: updateCallback,
    enabled: !pool,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return useAtomValue(poolAprAtom)[key] ?? { lpApr: '0', cakeApr: { value: '0' }, merklApr: '0' }
}

export const usePoolsApr = () => {
  return useAtomValue(poolAprAtom)
}

export const usePoolAprUpdater = () => {
  const pools = useAtomValue(emptyCakeAprPoolsAtom)
  const updateCakeApr = useSetAtom(cakeAprSetterAtom)
  const updateMerklApr = useSetAtom(merklAprAtom)
  const fetchMerklApr = useCallback(async () => {
    const merklAprs = await getAllNetworkMerklApr()
    updateMerklApr(merklAprs)
  }, [updateMerklApr])
  const fetchCakeApr = useCallback(
    async (newPools: PoolInfo[]) => {
      if (newPools && newPools.length) {
        newPools.forEach((pool) => {
          // @todo @ChefJerry ignore the ended farms
          getCakeApr(pool).then((apr) => {
            updateCakeApr(apr)
          })
        })
      }
    },
    [updateCakeApr],
  )

  useQuery({
    queryKey: ['apr', 'merkl', fetchMerklApr],
    queryFn: fetchMerklApr,
    refetchInterval: SLOW_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useQuery({
    queryKey: ['apr', 'cake', fetchCakeApr],
    queryFn: () => fetchCakeApr(pools),
    enabled: pools && pools.length > 0,
    refetchInterval: SLOW_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
