import assign from 'lodash/assign'
import chunk from 'lodash/chunk'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Protocol } from '@pancakeswap/farms'
import { DEPLOYER_ADDRESSES, computePoolAddress } from '@pancakeswap/v3-sdk'
import { Address } from 'viem/accounts'
import {
  DEFAULT_QUERIES,
  extendPoolsAtom,
  ExtendPoolsQuery,
  extendPoolsQueryAtom,
  poolsOfPositionAtom,
  PoolSortBy,
} from './atom'
import { fetchExplorerPoolsList } from './fetcher'
import type { PositionDetail, StableLPDetail, V2LPDetail } from '../accountPositions/type'
import getTokenByAddress from '../utils'
import type { ChainIdAddressKey } from '../type'

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

export function getKeyForPools(chainId: number, token0Address: Address, token1Address: Address) {
  return `${chainId}:${token0Address}-${token1Address}`
}

export const usePoolsByV3Positions = (positions: PositionDetail[]) => {
  const [poolsMap] = useAtom(poolsOfPositionAtom)
  const chains = useMemo(() => {
    const chainsSet = new Set<number>()
    positions.forEach((pos) => chainsSet.add(pos.chainId))
    return Array.from(chainsSet)
  }, [positions])

  const protocols = useMemo(() => [Protocol.V3], [])

  const poolsAddress = useMemo(
    () =>
      positions
        .map((pos) => {
          const deployerAddress = DEPLOYER_ADDRESSES[pos.chainId]
          const token0 = getTokenByAddress(pos.chainId, pos.token0)
          const token1 = getTokenByAddress(pos.chainId, pos.token1)
          if (!token0 || !token1) {
            return null
          }
          const key = getKeyForPools(pos.chainId, token0.address, token1.address)
          if (key in poolsMap) {
            return null
          }
          const address = computePoolAddress({
            deployerAddress,
            tokenA: token0,
            tokenB: token1,
            fee: pos.fee,
          })
          return `${pos.chainId}:${address}`
        })
        .filter((pos): pos is NonNullable<ChainIdAddressKey> => pos !== null),
    [positions],
  )

  useFetchPoolsListByPoolsAddress({
    poolsAddress,
    chains,
    protocols,
  })
  return { poolsMap }
}

export const usePoolsByV2Positions = (positions: V2LPDetail[]) => {
  const [poolsMap] = useAtom(poolsOfPositionAtom)
  const chains = useMemo(() => {
    const chainsSet = new Set<number>()
    positions.forEach((pos) => chainsSet.add(pos.pair.chainId))
    return Array.from(chainsSet)
  }, [positions])

  const protocols = useMemo(() => [Protocol.V2], [])

  const poolsAddress = useMemo(
    () =>
      positions
        .map((pos) => {
          const { token0, token1, chainId, liquidityToken } = pos.pair
          const key = getKeyForPools(chainId, token0.address, token1.address)
          if (key in poolsMap) {
            return null
          }
          return `${chainId}:${liquidityToken.address}`
        })
        .filter((pos): pos is NonNullable<ChainIdAddressKey> => pos !== null),
    [positions],
  )

  useFetchPoolsListByPoolsAddress({
    poolsAddress,
    chains,
    protocols,
  })
  return { poolsMap }
}

export const usePoolsByStablePositions = (positions: StableLPDetail[]) => {
  const [poolsMap] = useAtom(poolsOfPositionAtom)
  const chains = useMemo(() => {
    const chainsSet = new Set<number>()
    positions.forEach((pos) => chainsSet.add(pos.pair.liquidityToken.chainId))
    return Array.from(chainsSet)
  }, [positions])

  const protocols = useMemo(() => [Protocol.STABLE], [])

  const poolsAddress = useMemo(
    () =>
      positions
        .map((pos) => {
          const {
            token0,
            token1,
            liquidityToken: { chainId },
            stableSwapAddress,
          } = pos.pair
          const key = getKeyForPools(chainId, token0.wrapped.address, token1.wrapped.address)
          if (key in poolsMap) {
            return null
          }
          return `${chainId}:${stableSwapAddress}`
        })
        .filter((pos): pos is NonNullable<ChainIdAddressKey> => pos !== null),
    [positions],
  )

  useFetchPoolsListByPoolsAddress({
    poolsAddress,
    chains,
    protocols,
  })
  return { poolsMap }
}

const useFetchPoolsListByPoolsAddress = ({
  poolsAddress,
  chains,
  protocols,
}: {
  poolsAddress: ChainIdAddressKey[]
  chains: number[]
  protocols: Protocol[]
}) => {
  const [poolsMap, setPools] = useAtom(poolsOfPositionAtom)
  useEffect(() => {
    if (!poolsAddress.length) {
      return
    }
    const chunkPoolsAddress = chunk(poolsAddress, 50)
    for (const address of chunkPoolsAddress) {
      const query = {
        protocols,
        orderBy: PoolSortBy.VOL,
        chains,
        pools: address,
        tokens: [],
        before: '',
        after: '',
      }
      fetchExplorerPoolsList(query).then((res) => {
        const newPoolsMap = res.pools.reduce((acc, pool) => {
          // eslint-disable-next-line no-param-reassign
          acc[getKeyForPools(pool.chainId, pool.token0.wrapped.address, pool.token1.wrapped.address)] = pool
          return acc
        }, {})
        setPools(assign(newPoolsMap, poolsMap))
      })
    }
  }, [poolsAddress, chains, protocols])
}
