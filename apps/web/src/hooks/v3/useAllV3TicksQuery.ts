import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'

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
    enabled: Boolean(poolAddress && chainId && enabled),
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
