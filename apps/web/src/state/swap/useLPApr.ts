import { gql } from 'graphql-request'
import { Pair, ChainId } from '@pancakeswap/sdk'
import useSWRImmutable from 'swr/immutable'
import { getMultiChainQueryEndPointWithStableSwap, MultiChainName, multiChainQueryMainToken } from '../info/constant'
import { getDeltaTimestamps } from '../../utils/getDeltaTimestamps'
import { getBlocksFromTimestamps } from '../../utils/getBlocksFromTimestamps'
import { getChangeForPeriod } from '../../utils/getChangeForPeriod'
import { getLpFeesAndApr } from '../../utils/getLpFeesAndApr'
import { SLOW_INTERVAL } from '../../config/constants'

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
      const [block24h, block48h, block7d, block14d] = blocks ?? []
      const { error, data } = await fetchPoolVolumeAndReserveData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        pair.liquidityToken.address.toLowerCase(),
      )
      if (error) return null
      const current = parseFloat(data?.now[0]?.volumeUSD)
      const currentReserveUSD = parseFloat(data?.now[0]?.reserveUSD)
      const oneDay = parseFloat(data?.oneDayAgo[0]?.volumeUSD)
      const twoDays = parseFloat(data?.twoDaysAgo[0]?.volumeUSD)
      const week = parseFloat(data?.oneWeekAgo[0]?.volumeUSD)
      const twoWeeks = parseFloat(data?.twoWeeksAgo[0]?.volumeUSD)
      const [volumeUSD] = getChangeForPeriod(current, oneDay, twoDays)
      const [volumeUSDWeek] = getChangeForPeriod(current, week, twoWeeks)
      const liquidityUSD = currentReserveUSD || 0
      const { lpApr7d } = getLpFeesAndApr(volumeUSD, volumeUSDWeek, liquidityUSD)
      return lpApr7d ? { lpApr7d } : null
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return poolData
}
const fetchPoolVolumeAndReserveData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  poolAddress: string,
  chainName: 'ETH' | 'BSC' = 'BSC',
) => {
  const weeksQuery = chainName === 'BSC' ? `twoWeeksAgo: ${POOL_AT_BLOCK(chainName, block14d, poolAddress)}` : ''
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(chainName, null, poolAddress)}
        oneDayAgo: ${POOL_AT_BLOCK(chainName, block24h, poolAddress)}
        twoDaysAgo: ${POOL_AT_BLOCK(chainName, block48h, poolAddress)}
        oneWeekAgo: ${POOL_AT_BLOCK(chainName, block7d, poolAddress)}
        ${weeksQuery}
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
  const blockString = block ? `block: {number: ${block}}` : ``
  return `pairs(
    where: { id: "${pool}" }
    ${blockString}
    orderBy: trackedReserve${multiChainQueryMainToken[chainName]}
    orderDirection: desc
  ) {
    reserveUSD
    volumeUSD
  }`
}
