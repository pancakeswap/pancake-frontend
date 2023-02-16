import { INFO_CLIENT, STABLESWAP_SUBGRAPH_CLIENT } from 'config/constants/endpoints'
import { ONE_DAY_UNIX, ONE_HOUR_SECONDS } from 'config/constants/info'
import { getUnixTime, startOfHour, sub } from 'date-fns'
import mapValues from 'lodash/mapValues'
import orderBy from 'lodash/orderBy'
import { Block } from 'state/info/types'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import { getDerivedPrices, getDerivedPricesQueryConstructor } from '../queries/getDerivedPrices'
import { PairDataTimeWindowEnum } from '../types'

const getTokenDerivedUSDCPrices = async (tokenAddress: string, blocks: Block[], isStableStable?: boolean) => {
  const rawPrices: any | undefined = await multiQuery(
    getDerivedPricesQueryConstructor,
    getDerivedPrices(tokenAddress, blocks),
    isStableStable ? STABLESWAP_SUBGRAPH_CLIENT : INFO_CLIENT,
    200,
  )

  if (!rawPrices) {
    console.error('Price data failed to load')
    return null
  }

  const prices = mapValues(rawPrices, (value) => {
    return value.derivedUSD
  })

  // format token BNB price results
  const tokenPrices: {
    tokenAddress: string
    timestamp: string
    derivedUSD: number
  }[] = []

  // Get Token prices in BNB
  Object.keys(prices).forEach((priceKey) => {
    const timestamp = priceKey.split('t')[1]
    if (timestamp) {
      tokenPrices.push({
        tokenAddress,
        timestamp,
        derivedUSD: prices[priceKey] ? parseFloat(prices[priceKey]) : 0,
      })
    }
  })

  return orderBy(tokenPrices, (tokenPrice) => parseInt(tokenPrice.timestamp, 10))
}

const getInterval = (timeWindow: PairDataTimeWindowEnum) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
      return ONE_HOUR_SECONDS
    case PairDataTimeWindowEnum.WEEK:
      return ONE_HOUR_SECONDS * 4
    case PairDataTimeWindowEnum.MONTH:
      return ONE_DAY_UNIX
    case PairDataTimeWindowEnum.YEAR:
      return ONE_DAY_UNIX * 15
    default:
      return ONE_HOUR_SECONDS * 4
  }
}

const getSkipDaysToStart = (timeWindow: PairDataTimeWindowEnum) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
      return 1
    case PairDataTimeWindowEnum.WEEK:
      return 7
    case PairDataTimeWindowEnum.MONTH:
      return 30
    case PairDataTimeWindowEnum.YEAR:
      return 365
    default:
      return 7
  }
}

// Fetches derivedBnb values for tokens to calculate derived price
// Used when no direct pool is available
const fetchDerivedPriceData = async (
  token0Address: string,
  token1Address: string,
  timeWindow: PairDataTimeWindowEnum,
  // token0 has StableSwap involved
  token0StableStable?: boolean,
  // token1 has StableSwap involved
  token1StableStable?: boolean,
) => {
  const interval = getInterval(timeWindow)
  const endTimestamp = getUnixTime(new Date())
  const startTimestamp = getUnixTime(startOfHour(sub(endTimestamp * 1000, { days: getSkipDaysToStart(timeWindow) })))
  const timestamps = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }

  try {
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks for timestamps', timestamps)
      return null
    }
    blocks.pop() // the bsc graph is 32 block behind so pop the last
    const [token0DerivedUSD, token1DerivedUSD] = await Promise.all([
      getTokenDerivedUSDCPrices(token0Address, blocks, token0StableStable),
      getTokenDerivedUSDCPrices(token1Address, blocks, token1StableStable),
    ])
    return { token0DerivedUSD, token1DerivedUSD }
  } catch (error) {
    console.error('Failed to fetched derived price data for chart', error)
    return null
  }
}

export default fetchDerivedPriceData
