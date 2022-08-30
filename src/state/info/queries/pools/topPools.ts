import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient, infoClientETH } from 'utils/graphql'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useGetChainName } from '../../hooks'

interface TopPoolsResponse {
  pairDayDatas: {
    id: string
  }[]
}

const queryETH = gql`
  query topPools($blacklist: [String!], $timestamp24hAgo: Int) {
    pairDayDatas(first: 200, orderBy: dailyVolumeUSD, orderDirection: desc) {
      id
    }
  }
`

/**
 * Initial pools to display on the home page
 */
const fetchTopPools = async (timestamp24hAgo: number, chainName: 'ETH' | 'BSC'): Promise<string[]> => {
  try {
    const query = gql`
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
    const data = await (chainName === 'ETH'
      ? infoClientETH.request<TopPoolsResponse>(queryETH, { blacklist: TOKEN_BLACKLIST, timestamp24hAgo })
      : infoClient.request<TopPoolsResponse>(query, { blacklist: TOKEN_BLACKLIST, timestamp24hAgo }))
    // pairDayDatas id has compound id "0xPOOLADDRESS-NUMBERS", extracting pool address with .split('-')
    return data.pairDayDatas.map((p) => p.id.split('-')[0])
  } catch (error) {
    console.error('Failed to fetch top pools', error)
    return []
  }
}

/**
 * Fetch top addresses by volume
 */
const useTopPoolAddresses = (): string[] => {
  const [topPoolAddresses, setTopPoolAddresses] = useState([])
  const [timestamp24hAgo] = getDeltaTimestamps()
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const addresses = await fetchTopPools(timestamp24hAgo, chainName)
      setTopPoolAddresses(addresses)
    }
    if (topPoolAddresses.length === 0) {
      fetch()
    }
  }, [topPoolAddresses, timestamp24hAgo, chainName])

  return topPoolAddresses
}

export default useTopPoolAddresses
