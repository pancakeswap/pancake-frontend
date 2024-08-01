import { Protocol } from '@pancakeswap/farms'
import { computePoolAddress, DEPLOYER_ADDRESSES, FeeAmount } from '@pancakeswap/v3-sdk'
import { useAtom } from 'jotai'
import assign from 'lodash/assign'
import chunk from 'lodash/chunk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem/accounts'
import type { PositionDetail, StableLPDetail, V2LPDetail } from '../accountPositions/type'
import type { ChainIdAddressKey, PoolInfo } from '../type'
import getTokenByAddress from '../utils'
import {
  DEFAULT_QUERIES,
  extendPoolsAtom,
  ExtendPoolsQuery,
  extendPoolsQueryAtom,
  poolsOfPositionAtom,
  PoolSortBy,
} from './atom'
import { fetchExplorerPoolsList } from './fetcher'

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

export function getPoolAddressByToken(chainId: number, token0Address: Address, token1Address: Address, fee: FeeAmount) {
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
}

export const usePoolsByV3Positions = (positions: PositionDetail[]) => {
  const [poolsMap] = useAtom(poolsOfPositionAtom)
  const chains = useMemo(() => {
    const chainsSet = new Set<number>()
    positions.forEach((pos) => chainsSet.add(pos.chainId))
    return Array.from(chainsSet)
  }, [positions])

  const protocols = useMemo(() => [Protocol.V3], [])

  const poolsAddressMap = useMemo(
    () =>
      positions.reduce<{ [key: ChainIdAddressKey]: string }>((acc, pos) => {
        const key = getKeyForPools(pos.chainId, pos.tokenId.toString())
        if (key in poolsMap) {
          return acc
        }
        const address = getPoolAddressByToken(pos.chainId, pos.token0, pos.token1, pos.fee)
        // eslint-disable-next-line no-param-reassign
        acc[`${pos.chainId}:${address}`] = key
        return acc
      }, {}),
    [positions],
  )

  const getKey = useCallback(
    (pool: PoolInfo) => poolsAddressMap[`${pool.chainId}:${pool.lpAddress}`],
    [poolsAddressMap],
  )

  useFetchPoolsListByPoolsAddress({
    poolsAddress: Object.keys(poolsAddressMap) as ChainIdAddressKey[],
    chains,
    protocols,
    getKey,
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
          const { chainId, liquidityToken } = pos.pair
          const key = getKeyForPools(chainId, liquidityToken.address)
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
            liquidityToken: { chainId },
            stableSwapAddress,
          } = pos.pair
          const key = getKeyForPools(chainId, stableSwapAddress)
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
  getKey,
}: {
  poolsAddress: ChainIdAddressKey[]
  chains: number[]
  protocols: Protocol[]
  getKey?: (pool: PoolInfo) => string
}) => {
  const [poolsMap, setPools] = useAtom(poolsOfPositionAtom)
  useEffect(() => {
    if (!poolsAddress.length) {
      return
    }
    const chunkPoolsAddress = chunk(poolsAddress, 20)
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
          acc[getKey ? getKey(pool) : getKeyForPools(pool.chainId, pool.lpAddress)] = pool
          return acc
        }, {})
        setPools(assign(newPoolsMap, poolsMap))
      })
    }
  }, [poolsAddress, chains, protocols])
}
