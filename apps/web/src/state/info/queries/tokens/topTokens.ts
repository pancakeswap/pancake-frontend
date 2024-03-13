import { gql } from 'graphql-request'
import union from 'lodash/union'
import { useCallback, useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import {
  MultiChainNameExtend,
  checkIsStableSwap,
  getMultiChainQueryEndPointWithStableSwap,
  multiChainTokenBlackList,
  multiChainTokenWhiteList,
} from '../../constant'
import { useGetChainName } from '../../hooks'

interface TopTokensResponse {
  tokenDayDatas: {
    id: string
  }[]
}

interface StableSwapTopTokensResponse {
  tokens: {
    id: string
  }[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
const fetchTopTokens = async (chainName: MultiChainNameExtend, timestamp24hAgo: number): Promise<string[]> => {
  const whereCondition =
    chainName === 'ETH'
      ? `where: { date_gt: ${timestamp24hAgo}, token_not_in: $blacklist, dailyVolumeUSD_gt:2000 }`
      : checkIsStableSwap()
      ? ''
      : `where: { dailyTxns_gt: ${chainName === 'BSC' ? 300 : 0}, id_not_in: $blacklist, date_gt: ${timestamp24hAgo}}`
  const firstCount = 50
  try {
    const query = gql`
      query topTokens($blacklist: [ID!]) {
        tokenDayDatas(
          first: ${firstCount}
          ${whereCondition}
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `

    const stableSwapQuery = gql`
      query topTokens {
        tokens(
          first: ${firstCount}
          ${whereCondition}
          orderBy: totalLiquidity
          orderDirection: desc
        ) {
          id
        }
      }
    `

    if (checkIsStableSwap()) {
      const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<StableSwapTopTokensResponse>(
        stableSwapQuery,
      )
      return union(
        data.tokens.map((t) => t.id),
        multiChainTokenWhiteList[chainName],
      )
    }
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TopTokensResponse>(query, {
      blacklist: multiChainTokenBlackList[chainName],
    })
    // tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
    return union(
      data.tokenDayDatas.map((t) => t.id.split('-')[0]),
      multiChainTokenWhiteList[chainName],
    )
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
  const [topTokenAddresses, setTopTokenAddresses] = useState<string[]>([])
  const [timestamp24hAgo] = getDeltaTimestamps()
  const chainName = useGetChainName()

  const fetch = useCallback(async () => {
    if (!chainName) return
    const addresses = await fetchTopTokens(chainName, timestamp24hAgo)
    if (addresses.length > 0) setTopTokenAddresses(addresses)
  }, [timestamp24hAgo, chainName])

  useEffect(() => {
    fetch()
  }, [chainName, fetch])

  return topTokenAddresses
}

export const fetchTokenAddresses = async (chainName: MultiChainNameExtend) => {
  const [timestamp24hAgo] = getDeltaTimestamps()

  const addresses = await fetchTopTokens(chainName, timestamp24hAgo)

  return addresses
}

export default useTopTokenAddresses
