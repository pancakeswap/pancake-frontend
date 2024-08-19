import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { extendPoolsAtom } from '../extendPools/atom'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { cakeAprSetterAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr, getLpApr } from './fetcher'

export const usePoolApr = (key: ChainIdAddressKey | null, pool: PoolInfo) => {
  const updatePools = useSetAtom(extendPoolsAtom)
  const updateCakeApr = useSetAtom(cakeAprSetterAtom)
  const poolApr = useAtomValue(poolAprAtom)[key ?? '']
  const updateCallback = useCallback(async () => {
    const [lpApr, cakeApr] = await Promise.all([getLpApr(pool), getCakeApr(pool)])
    updatePools([{ ...pool, lpApr: `${lpApr}` }])
    updateCakeApr(cakeApr)
    return {
      lpApr: `${lpApr}`,
      cakeApr,
      merklApr: '0',
    }
  }, [pool, updateCakeApr, updatePools])

  useQuery({
    queryKey: ['apr', key],
    queryFn: updateCallback,
    enabled: !!pool && !poolApr?.lpApr && !!key,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return poolApr ?? { lpApr: '0', cakeApr: { value: '0' }, merklApr: '0' }
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
