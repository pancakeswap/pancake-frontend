import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAtomValue, useSetAtom } from 'jotai'
import chunk from 'lodash/chunk'
import { useCallback, useEffect } from 'react'
import { ChainIdAddressKey, PoolInfo } from '../type'
import { CakeApr, cakeAprAtom, emptyCakeAprPoolsAtom, merklAprAtom, poolAprAtom } from './atom'
import { getAllNetworkMerklApr, getCakeApr } from './fetcher'

export const usePoolApr = (key: ChainIdAddressKey) => {
  return useAtomValue(poolAprAtom)[key]
}

export const usePoolsApr = () => {
  return useAtomValue(poolAprAtom)
}

export const usePoolAprUpdater = () => {
  const pools = useAtomValue(emptyCakeAprPoolsAtom)
  const updateCakeApr = useSetAtom(cakeAprAtom)
  const cakePrice = useCakePrice()
  const updateMerklApr = useSetAtom(merklAprAtom)
  const fetchMerklApr = useCallback(async () => {
    const merklAprs = await getAllNetworkMerklApr()
    updateMerklApr(merklAprs)
  }, [updateMerklApr])
  const fetchCakeApr = useCallback(
    async (fetchPools: PoolInfo[], _cakePrice: BigNumber) => {
      if (fetchPools && fetchPools.length && !_cakePrice.isZero()) {
        // @todo @ChefJerry refactor to multicall
        const result = {} as CakeApr
        const chunks = chunk(fetchPools, 100)
        for await (const c of chunks) {
          for await (const pool of c) {
            const cakeApr = await getCakeApr(pool, _cakePrice)
            result[`${pool.chainId}:${pool.lpAddress}`] = cakeApr
          }
        }
        updateCakeApr(result)
      }
    },
    [updateCakeApr],
  )

  useEffect(() => {
    fetchMerklApr()
  }, [fetchMerklApr])

  useEffect(() => {
    fetchCakeApr(pools, cakePrice)
  }, [cakePrice, fetchCakeApr, pools])
}
