import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { v3Clients } from 'utils/graphql'
import { useActiveChainId } from 'hooks/useActiveChainId'

export type AllV3TicksQuery = {
  __typename?: 'Query'
  ticks: Array<{ __typename?: 'Tick'; liquidityNet: any; price0: any; price1: any; tick: any }>
}

export type Ticks = AllV3TicksQuery['ticks']
export type TickData = Ticks[number]

export default function useAllV3TicksQuery(poolAddress: string | undefined, interval: number) {
  const { chainId } = useActiveChainId()
  const { data, isLoading, error } = useSWRImmutable(
    poolAddress && v3Clients[chainId] ? `useAllV3TicksQuery-${poolAddress}-${chainId}` : null,
    async () => {
      return fetch(`/api/v3/${chainId}/ticks/${poolAddress}`)
        .then((res) => res.json())
        .then((d) => d.data)
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(
    () => ({
      error,
      isLoading,
      data,
    }),
    [data, error, isLoading],
  )
}
