import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { TOKEN_BLACKLIST } from 'config/info'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
export const TOP_TOKENS = gql`
  query topTokens($blacklist: [String!], $timestamp24hAgo: Int) {
    tokenDayDatas(
      first: 30
      where: { dailyTxns_gt: 300, id_not_in: $blacklist, date_gt: $timestamp24hAgo }
      orderBy: dailyVolumeUSD
      orderDirection: desc
    ) {
      id
    }
  }
`

interface TopTokensResponse {
  tokenDayDatas: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopTokenAddresses(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const [timestamp24hAgo] = useDeltaTimestamps()
  const { loading, error, data } = useQuery<TopTokensResponse>(TOP_TOKENS, {
    variables: { blacklist: TOKEN_BLACKLIST, timestamp24hAgo },
  })

  const formattedData = useMemo(() => {
    if (data) {
      // tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
      return data.tokenDayDatas.map((t) => t.id.split('-')[0])
    }
    return undefined
  }, [data])

  return {
    loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}
