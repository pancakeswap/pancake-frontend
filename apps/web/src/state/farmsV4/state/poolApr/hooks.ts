import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAtom, useAtomValue } from 'jotai'
import chunk from 'lodash/chunk'
import { useCallback, useEffect } from 'react'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { emptyAprPoolsAtom, PoolApr, poolAprAtom } from './atom'
import { getCakeApr } from './fetcher'

export const usePoolApr = (key: ChainIdAddressKey) => {
  return useAtomValue(poolAprAtom)[key]
}

export const usePoolsApr = () => {
  return useAtomValue(poolAprAtom)
}

export const usePoolAprUpdater = () => {
  const pools = useAtomValue(emptyAprPoolsAtom)
  const [, setAprs] = useAtom(poolAprAtom)
  const cakePrice = useCakePrice()
  const fetchApr = useCallback(
    async (fetchPools: PoolInfo[], _cakePrice: BigNumber) => {
      if (fetchPools && fetchPools.length && !_cakePrice.isZero()) {
        const chunks = chunk(fetchPools, 100)
        for await (const c of chunks) {
          const result = {} as PoolApr
          for await (const pool of c) {
            const cakeApr = await getCakeApr(pool, _cakePrice)
            result[`${pool.chainId}:${pool.lpAddress}`] = {
              lpApr: {
                value: pool.lpApr ?? '0',
              },
              cakeApr,
              merklApr: {
                value: '0',
              },
            }
          }
          setAprs(result)
        }
      }
    },
    [setAprs],
  )

  useEffect(() => {
    fetchApr(pools, cakePrice)
  }, [cakePrice, fetchApr, pools])
}
