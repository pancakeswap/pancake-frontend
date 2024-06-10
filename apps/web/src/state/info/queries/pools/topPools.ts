import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import {
  MultiChainName,
  checkIsStableSwap,
  getMultiChainQueryEndPointWithStableSwap,
  multiChainTokenBlackList,
} from '../../constant'
import { useGetChainName } from '../../hooks'

interface TopPoolsResponse {
  pairDayDatas: {
    id: string
  }[]
}

const getQuery = (firstCount: number, whereCondition: string) => gql`
      query topPools($blacklist: [String!]) {
        pairDayDatas(
          first: ${firstCount}
          ${whereCondition}
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `

/**
 * Initial pools to display on the home page
 */
const fetchTopPools = async (chainName: MultiChainName | null, timestamp24hAgo: number): Promise<string[]> => {
  if (!chainName) return []
  const isStableSwap = checkIsStableSwap()
  const firstCount = isStableSwap ? 100 : 30
  let whereCondition =
    chainName === 'BSC'
      ? `where: { dailyTxns_gt: 300, token0_not_in: $blacklist, token1_not_in: $blacklist, date_gt: ${timestamp24hAgo} }`
      : `where: { date_gt: ${timestamp24hAgo}, token0_not_in: $blacklist, token1_not_in: $blacklist, dailyVolumeUSD_gt: 2000 }`
  if (isStableSwap) whereCondition = `where: { date_gt: ${timestamp24hAgo}}`
  try {
    let data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TopPoolsResponse>(
      getQuery(firstCount, whereCondition),
      {
        blacklist: multiChainTokenBlackList[chainName],
      },
    )
    if (data.pairDayDatas.length === 0)
      data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TopPoolsResponse>(
        getQuery(firstCount, ''),
        {
          blacklist: multiChainTokenBlackList[chainName],
        },
      )
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
  const [topPoolAddresses, setTopPoolAddresses] = useState<string[]>([])
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

export const fetchTopPoolAddresses = async (chainName: MultiChainName) => {
  const [timestamp24hAgo] = getDeltaTimestamps()

  const addresses = await fetchTopPools(chainName, timestamp24hAgo)
  return addresses
}

export default useTopPoolAddresses
