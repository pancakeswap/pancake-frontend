import useSWRImmutable from 'swr/immutable'
import { gql } from 'graphql-request'
import { useMemo } from 'react'
import { uniswapClient } from 'utils/graphql'

const query = gql`
  query AllV3Ticks($poolAddress: String!, $skip: Int!) {
    ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
      tick: tickIdx
      liquidityNet
      price0
      price1
    }
  }
`

export type AllV3TicksQuery = {
  __typename?: 'Query'
  ticks: Array<{ __typename?: 'Tick'; liquidityNet: any; price0: any; price1: any; tick: any }>
}

export type Ticks = AllV3TicksQuery['ticks']
export type TickData = Ticks[number]

export default function useAllV3TicksQuery(poolAddress: string | undefined, skip: number, interval: number) {
  const { data, isLoading, error } = useSWRImmutable(
    poolAddress ? `useAllV3TicksQuery-${poolAddress}` : null,
    async () => {
      return uniswapClient.request(query, {
        poolAddress: poolAddress?.toLowerCase(),
        skip,
      })
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
