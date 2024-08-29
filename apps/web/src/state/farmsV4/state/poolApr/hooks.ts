import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { extendPoolsAtom } from '../extendPools/atom'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { CakeApr, cakeAprSetterAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr, getLpApr } from './fetcher'

export const usePoolApr = (
  key: ChainIdAddressKey | null,
  pool: PoolInfo,
): {
  lpApr: `${number}`
  cakeApr: CakeApr[keyof CakeApr]
  merklApr: `${number}`
} => {
  const updatePools = useSetAtom(extendPoolsAtom)
  const updateCakeApr = useSetAtom(cakeAprSetterAtom)
  const poolApr = useAtomValue(poolAprAtom)[key ?? '']
  const [merklAprs, updateMerklApr] = useAtom(merklAprAtom)
  const getMerklApr = useCallback(() => {
    if (Object.values(merklAprs).length === 0) {
      return getAllNetworkMerklApr().then((aprs) => {
        updateMerklApr(aprs)
        return aprs[key!] ?? '0'
      })
    }
    return merklAprs[key!] ?? '0'
  }, [key, merklAprs, updateMerklApr])
  const updateCallback = useCallback(async () => {
    try {
      const [cakeApr, lpApr, merklApr] = await Promise.all([
        getCakeApr(pool).then((apr) => {
          updateCakeApr(apr)
          return apr
        }),
        getLpApr(pool)
          .then((apr) => {
            updatePools([{ ...pool, lpApr: `${apr}` }])
            return `${apr}`
          })
          .catch(() => {
            console.warn('error getLpApr', pool)
            updatePools([{ ...pool, lpApr: '0' }])
            return '0'
          }),
        ,
        getMerklApr(),
      ])
      return {
        lpApr: `${lpApr}`,
        cakeApr,
        merklApr,
      }
    } catch (error) {
      console.warn('error usePoolApr', error)
      return {
        lpApr: '0',
        cakeApr: { value: '0' },
        merklApr: '0',
      }
    }
  }, [getMerklApr, pool, updateCakeApr, updatePools])

  useQuery({
    queryKey: ['apr', key],
    queryFn: updateCallback,
    // calcV3PoolApr depend on pool's TvlUsd
    // so if there are local pool without tvlUsd, don't to fetch queryFn
    // issue: PAN-3698
    enabled: typeof pool?.tvlUsd !== 'undefined' && !poolApr?.lpApr && !!key,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return {
    lpApr: poolApr?.lpApr ?? '0',
    cakeApr: poolApr?.cakeApr ?? { value: '0' },
    merklApr: poolApr?.merklApr ?? '0',
  }
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
