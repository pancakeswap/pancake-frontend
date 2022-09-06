import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient, infoClientETH } from 'utils/graphql'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useGetChainName } from '../../hooks'
import { multiChainQueryClient, MultiChianName } from '../../constant'

interface TopPoolsResponse {
  pairDayDatas: {
    id: string
  }[]
}

/**
 * Initial pools to display on the home page
 */
const fetchTopPools = async (chainName: MultiChianName, timestamp24hAgo: number): Promise<string[]> => {
  const whereCondition =
    chainName === 'BSC'
      ? 'where: { dailyTxns_gt: 300, token0_not_in: $blacklist, token1_not_in: $blacklist, date_gt: $timestamp24hAgo }'
      : ''
  try {
    const query = gql`
      query topPools($blacklist: [String!], $timestamp24hAgo: Int) {
        pairDayDatas(
          first: 30
          ${whereCondition}
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `
    const data = await multiChainQueryClient[chainName].request<TopPoolsResponse>(query, {
      blacklist: TOKEN_BLACKLIST,
      timestamp24hAgo,
    })
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
      const addresses = await fetchTopPools(chainName, timestamp24hAgo)
      setTopPoolAddresses(addresses)
    }
    if (topPoolAddresses.length === 0) {
      fetch()
    }
  }, [topPoolAddresses, timestamp24hAgo, chainName])

  return topPoolAddresses
}

export default useTopPoolAddresses
