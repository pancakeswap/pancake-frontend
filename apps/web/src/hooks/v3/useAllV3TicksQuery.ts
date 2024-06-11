import { ChainId } from '@pancakeswap/chains'
import { TickMath } from '@pancakeswap/v3-sdk'
import { useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { v3Clients } from 'utils/graphql'

export type AllV3TicksQuery = {
  ticks: Array<{
    tick: string
    liquidityNet: string
    liquidityGross: string
  }>
}

export type Ticks = AllV3TicksQuery['ticks']
export type TickData = Ticks[number]

export default function useAllV3TicksQuery(poolAddress: string | undefined, interval: number, enabled = true) {
  const { chainId } = useActiveChainId()
  const { data, isLoading, error } = useQuery({
    queryKey: [`useAllV3TicksQuery-${poolAddress}-${chainId}`],
    queryFn: async ({ signal }) => {
      if (!chainId || !poolAddress) return undefined
      return getPoolTicks(chainId, poolAddress, undefined, signal)
    },
    enabled: Boolean(poolAddress && chainId && v3Clients[chainId] && enabled),
    refetchInterval: interval,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return useMemo(
    () => ({
      error,
      isLoading,
      data,
    }),
    [data, error, isLoading],
  )
}

export async function getPoolTicks(
  chainId: number,
  poolAddress: string,
  _blockNumber?: string,
  signal?: AbortSignal,
): Promise<Ticks> {
  const chainName = chainIdToExplorerInfoChainName[chainId]
  if (!chainName) {
    return []
  }

  let max = 10
  let after: string | undefined
  const allTicks: Ticks = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (max <= 0) {
      break
    }
    if (!after && max < 10) {
      break
    }
    max--

    // eslint-disable-next-line no-await-in-loop
    const resp = await explorerApiClient.GET('/cached/pools/ticks/v3/{chainName}/{pool}', {
      signal,
      params: {
        path: {
          chainName,
          pool: poolAddress.toLowerCase(),
        },
        query: {
          after,
        },
      },
    })

    if (!resp.data) {
      break
    }
    if (resp.data.rows.length === 0) {
      break
    }
    if (resp.data.hasNextPage && resp.data.endCursor) {
      after = resp.data.endCursor
    } else {
      after = undefined
    }

    allTicks.push(
      ...resp.data.rows.map((tick) => {
        return {
          tick: tick.tickIdx.toString(),
          liquidityNet: tick.liquidityNet,
          liquidityGross: tick.liquidityGross,
        }
      }),
    )
  }

  return allTicks
}
export async function getPoolTicksOld(chainId: number, poolAddress: string, blockNumber?: string): Promise<Ticks> {
  const PAGE_SIZE = 1000
  let allTicks: any[] = []
  let lastTick = TickMath.MIN_TICK - 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const ticks = await _getPoolTicksGreaterThan(chainId, poolAddress, lastTick, PAGE_SIZE, blockNumber)
    allTicks = [...allTicks, ...ticks]
    const hasMore = ticks.length === PAGE_SIZE

    if (!hasMore) {
      break
    }
    lastTick = Number(ticks[ticks.length - 1].tick)
  }
  return allTicks
}

async function _getPoolTicksGreaterThan(
  chainId: number,
  poolAddress: string,
  tick: number,
  pageSize: number,
  blockNumber?: string,
) {
  const client = v3Clients[<ChainId>(<unknown>chainId)]
  if (!client) {
    return []
  }
  const response = await client.request(
    gql`
        query AllV3Ticks($poolAddress: String!, $lastTick: Int!, $pageSize: Int!) {
          ticks(
            first: $pageSize,
            ${blockNumber ? `block: { number: ${blockNumber} }` : ''}
            where: {
              poolAddress: $poolAddress,
              tickIdx_gt: $lastTick,
            },
            orderBy: tickIdx
          ) {
        tick: tickIdx
        liquidityNet
        liquidityGross
          }
        }
      `,
    {
      poolAddress: poolAddress.toLowerCase(),
      lastTick: tick,
      pageSize,
    },
  )
  return response.ticks
}
