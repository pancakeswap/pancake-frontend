import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import sha256 from 'crypto-js/sha256'
import memoize from 'lodash/memoize'
import { extendPoolsAtom } from 'state/farmsV4/state/extendPools/atom'
import { useCakePrice } from 'hooks/useCakePrice'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { CakeApr, cakeAprSetterAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr, getLpApr } from './fetcher'

const generatePoolKey = memoize((pools) => {
  const poolData = pools.map((pool) => `${pool.chainId}:${pool.lpAddress}`).join(',')
  return sha256(poolData).toString()
})

export const usePoolApr = (
  key: ChainIdAddressKey | null,
  pool: PoolInfo | null,
): {
  lpApr: `${number}`
  cakeApr: CakeApr[keyof CakeApr]
  merklApr: `${number}`
} => {
  const updatePools = useSetAtom(extendPoolsAtom)
  const updateCakeApr = useSetAtom(cakeAprSetterAtom)
  const poolApr = useAtomValue(poolAprAtom)[key ?? '']
  const [merklAprs, updateMerklApr] = useAtom(merklAprAtom)
  const cakePrice = useCakePrice()
  const getMerklApr = useCallback(() => {
    if (Object.values(merklAprs).length === 0) {
      return getAllNetworkMerklApr()
        .then((aprs) => {
          updateMerklApr(aprs)
          return aprs[key!] ?? '0'
        })
        .catch((error) => {
          console.error('Error fetching Merkl APR:', error)
          return '0'
        })
    }
    return merklAprs[key!] ?? '0'
  }, [key, merklAprs, updateMerklApr])
  const updateCallback = useCallback(async () => {
    try {
      if (!pool) {
        throw new Error('Pool not found')
      }
      const [cakeApr, lpApr, merklApr] = await Promise.all([
        getCakeApr(pool, cakePrice).then((apr) => {
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
        getMerklApr(),
      ])
      return {
        lpApr: `${lpApr}`,
        cakeApr,
        merklApr,
      } as {
        lpApr: `${number}`
        cakeApr: CakeApr[keyof CakeApr]
        merklApr: `${number}`
      }
    } catch (error) {
      console.warn('error usePoolApr', error)
      return {
        lpApr: '0',
        cakeApr: { value: '0' },
        merklApr: '0',
      } as {
        lpApr: `${number}`
        cakeApr: CakeApr[keyof CakeApr]
        merklApr: `${number}`
      }
    }
  }, [getMerklApr, pool, updateCakeApr, updatePools, cakePrice])

  useQuery({
    queryKey: ['apr', key],
    queryFn: updateCallback,
    // calcV3PoolApr depend on pool's TvlUsd
    // so if there are local pool without tvlUsd, don't to fetch queryFn
    // issue: PAN-3698
    enabled: typeof pool?.tvlUsd !== 'undefined' && !poolApr?.lpApr && !!key && cakePrice && cakePrice.gt(BIG_ZERO),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
  const cakePrice = useCakePrice()

  useQuery({
    queryKey: ['apr', 'merkl', 'fetchMerklApr'],
    queryFn: ({ signal }) => getAllNetworkMerklApr(signal).then(updateMerklApr),
    refetchInterval: SLOW_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useQuery({
    queryKey: ['apr', 'cake', 'fetchCakeApr', generatePoolKey(pools)],
    queryFn: () =>
      Promise.all(pools.map((pool) => getCakeApr(pool, cakePrice))).then((aprList) => {
        updateCakeApr(aprList.reduce((acc, apr) => Object.assign(acc, apr), {}))
      }),
    enabled: pools?.length > 0 && cakePrice && cakePrice.gt(BIG_ZERO),
    refetchInterval: SLOW_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
