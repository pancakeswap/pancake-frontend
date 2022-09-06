import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useGetChainName } from '../../hooks'
import { MultiChianName, multiChainQueryClient } from '../../constant'

interface TopTokensResponse {
  tokenDayDatas: {
    id: string
  }[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
const fetchTopTokens = async (chainName: MultiChianName, timestamp24hAgo: number): Promise<string[]> => {
  const whereCondition =
    chainName === 'ETH' ? '' : `where: { dailyTxns_gt: 300, id_not_in: $blacklist, date_gt: $timestamp24hAgo}`
  try {
    const query = gql`
      query topTokens($blacklist: [String!], $timestamp24hAgo: Int) {
        tokenDayDatas(
          first: 30
          ${whereCondition}
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `
    const data = await multiChainQueryClient[chainName].request<TopTokensResponse>(query, {
      blacklist: TOKEN_BLACKLIST,
      timestamp24hAgo,
    })
    console.warn('fetchTopTokens', { chainName, data, query, timestamp24hAgo })
    // tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
    return data.tokenDayDatas.map((t) => t.id.split('-')[0])
  } catch (error) {
    console.warn('fetchTopTokens', { chainName, timestamp24hAgo })
    console.error('Failed to fetch top tokens', error)
    return []
  }
}

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
  const [topTokenAddresses, setTopTokenAddresses] = useState([])
  const [timestamp24hAgo] = getDeltaTimestamps()
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const addresses = await fetchTopTokens(chainName, timestamp24hAgo)
      if (addresses.length > 0) setTopTokenAddresses(addresses)
    }
    if (topTokenAddresses.length === 0) {
      fetch()
    }
  }, [topTokenAddresses, timestamp24hAgo, chainName])

  return topTokenAddresses
}

export default useTopTokenAddresses
