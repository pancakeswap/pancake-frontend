import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAtom, useAtomValue } from 'jotai'
import chunk from 'lodash/chunk'
import { useCallback, useEffect } from 'react'
import { emptyAprPoolsAtom, PoolApr, poolAprAtom } from './state/poolApr/atom'
import { getCakeApr } from './state/poolApr/fetcher'
import { PoolInfo } from './state/type'

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
