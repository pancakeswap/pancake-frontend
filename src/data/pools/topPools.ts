import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { TOKEN_BLACKLIST } from 'config/info'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'

/**
 * Initial pools to display on the home page
 */
export const TOP_POOLS = gql`
  query topPools($blacklist: [String!], $timestamp24hAgo: Int) {
    pairDayDatas(
      first: 30
      where: { dailyTxns_gt: 300, token0_not_in: $blacklist, token1_not_in: $blacklist, date_gt: $timestamp24hAgo }
      orderBy: dailyVolumeUSD
      orderDirection: desc
    ) {
      id
    }
  }
`

interface TopPoolsResponse {
  pairDayDatas: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export const useTopPoolAddresses = (): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} => {
  const [timestamp24hAgo] = useDeltaTimestamps()
  const { loading, error, data } = useQuery<TopPoolsResponse>(TOP_POOLS, {
    variables: {
      blacklist: TOKEN_BLACKLIST,
      timestamp24hAgo,
    },
    fetchPolicy: 'network-only',
  })

  const formattedData = useMemo(() => {
    if (data) {
      // pairDayDatas id has compound id "0xPOOLADDRESS-NUMBERS", extracting pool address with .split('-')
      return data.pairDayDatas.map((p) => p.id.split('-')[0])
    }
    return undefined
  }, [data])

  return {
    loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}
