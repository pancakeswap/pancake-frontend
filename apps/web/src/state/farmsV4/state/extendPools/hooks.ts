import memoize from 'lodash/memoize'
import { useQuery } from '@tanstack/react-query'
import { computePoolAddress, DEPLOYER_ADDRESSES, FeeAmount } from '@pancakeswap/v3-sdk'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { Address } from 'viem/accounts'
import type { PoolInfo } from '../type'
import { getTokenByAddress } from '../utils'
import { DEFAULT_QUERIES, extendPoolsAtom, ExtendPoolsQuery, extendPoolsQueryAtom } from './atom'
import { fetchExplorerPoolInfo, fetchExplorerPoolsList } from './fetcher'

const RESET_QUERY_KEYS = ['protocols', 'orderBy', 'chains', 'pools', 'tokens'] as Array<keyof ExtendPoolsQuery>

export const useExtendPools = () => {
  const [query, _setQuery] = useAtom(extendPoolsQueryAtom)
  const [extendPools, updateExtendPools] = useAtom(extendPoolsAtom)
  const [pageEnd, setPageEnd] = useState(false)
  const fetchPoolList = useCallback(
    async (newQuery: Partial<ExtendPoolsQuery>) => {
      const mergedQueries = {
        ...query,
        ...newQuery,
      } as Required<ExtendPoolsQuery>

      let shouldReset = false
      for (const key of RESET_QUERY_KEYS) {
        if (mergedQueries[key] !== query[key]) {
          shouldReset = true
          break
        }
      }

      if (pageEnd) {
        if (shouldReset) {
          setPageEnd(false)
          mergedQueries.after = ''
        } else {
          return false
        }
      }

      const { pools, endCursor, hasNextPage } = await fetchExplorerPoolsList(mergedQueries)

      setPageEnd(!hasNextPage)
      if (shouldReset) {
        updateExtendPools([])
      }
      updateExtendPools(pools)
      _setQuery({ ...mergedQueries, after: endCursor ?? '' })

      return hasNextPage
    },
    [_setQuery, pageEnd, query, updateExtendPools],
  )

  const resetExtendPools = useCallback(() => {
    if (extendPools.length) {
      updateExtendPools([])
    }
    setPageEnd(false)
    _setQuery(DEFAULT_QUERIES)
  }, [_setQuery, setPageEnd, updateExtendPools, extendPools])

  return {
    extendPools,
    fetchPoolList,
    resetExtendPools,
  }
}

export function getKeyForPools(chainId: number, poolAddress: Address | string) {
  return `${chainId}:${poolAddress}`
}

export const getPoolAddressByToken = memoize(
  (chainId: number, token0Address: Address, token1Address: Address, fee: FeeAmount) => {
    const deployerAddress = DEPLOYER_ADDRESSES[chainId]
    const token0 = getTokenByAddress(chainId, token0Address)
    const token1 = getTokenByAddress(chainId, token1Address)
    if (!token0 || !token1) {
      return null
    }
    return computePoolAddress({
      deployerAddress,
      tokenA: token0,
      tokenB: token1,
      fee,
    })
  },
  (chainId: number, token0Address: Address, token1Address: Address, fee: FeeAmount) =>
    `${chainId}#${token0Address}#${token1Address}#${fee}`,
)

export const usePoolInfo = ({
  poolAddress,
  chainId,
}: {
  poolAddress: string | null
  chainId: number
}): PoolInfo | undefined | null => {
  const { data: poolInfo } = useQuery({
    queryKey: ['poolInfo', chainId, poolAddress],
    queryFn: () => fetchExplorerPoolInfo(poolAddress ?? '', chainId),
    enabled: !!poolAddress && !!chainId,
  })

  return poolInfo
}
