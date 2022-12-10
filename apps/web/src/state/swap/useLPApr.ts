import { gql } from 'graphql-request'
import { Pair, ChainId } from '@pancakeswap/sdk'
import useSWRImmutable from 'swr/immutable'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { SLOW_INTERVAL } from 'config/constants'
import { LP_HOLDERS_FEE, WEEKS_IN_YEAR } from 'config/constants/info'
import { getMultiChainQueryEndPointWithStableSwap, MultiChainName, multiChainQueryMainToken } from '../info/constant'

interface PoolReserveVolume {
  reserveUSD: string
  volumeUSD: string
}

interface PoolReserveVolumeResponse {
  now: PoolReserveVolume[]
  oneDayAgo: PoolReserveVolume[]
  twoDaysAgo: PoolReserveVolume[]
  oneWeekAgo: PoolReserveVolume[]
  twoWeeksAgo: PoolReserveVolume[]
}

export const useLPApr = (pair?: Pair) => {
  const { data: poolData } = useSWRImmutable(
    pair && pair.chainId === ChainId.BSC ? ['LP7dApr', pair.liquidityToken.address] : null,
    async () => {
      const timestampsArray = getDeltaTimestamps()
      const blocks = await getBlocksFromTimestamps(timestampsArray, 'desc', 1000)
      const [, , block7d] = blocks ?? []
      const { error, data } = await fetchPoolVolumeAndReserveData(
        block7d.number,
        pair.liquidityToken.address.toLowerCase(),
      )
      if (error) return null
      const current = parseFloat(data?.now[0]?.volumeUSD)
      const currentReserveUSD = parseFloat(data?.now[0]?.reserveUSD)
      const week = parseFloat(data?.oneWeekAgo[0]?.volumeUSD)
      const [volumeUSDWeek] = getChangeForPeriod(current, week)
      const liquidityUSD = currentReserveUSD || 0
      const lpApr7d = liquidityUSD > 0 ? (volumeUSDWeek * LP_HOLDERS_FEE * WEEKS_IN_YEAR * 100) / liquidityUSD : 0
      return lpApr7d ? { lpApr7d } : null
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return poolData
}
const fetchPoolVolumeAndReserveData = async (
  block7d: number,
  poolAddress: string,
  chainName: 'ETH' | 'BSC' = 'BSC',
) => {
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(chainName, null, poolAddress)}
        oneWeekAgo: ${POOL_AT_BLOCK(chainName, block7d, poolAddress)}
      }
    `

    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<PoolReserveVolumeResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pool data', error)
    return { error: true }
  }
}
const POOL_AT_BLOCK = (chainName: MultiChainName, block: number | null, pool: string) => {
  const addressesString = `["${pool}"]`
  const blockString = block ? `block: {number: ${block}}` : ``
  return `pairs(
    where: { id_in: ${addressesString} }
    ${blockString}
    orderBy: trackedReserve${multiChainQueryMainToken[chainName]}
    orderDirection: desc
  ) {
    reserveUSD
    volumeUSD
  }`
}
