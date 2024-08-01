import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { cakeAprSetterAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr } from './fetcher'

export const usePoolApr = (key: ChainIdAddressKey) => {
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
