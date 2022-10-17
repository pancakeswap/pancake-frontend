import { getUnixTime } from 'date-fns'
import { gql } from 'graphql-request'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import { PriceChartEntry } from 'state/info/types'
import orderBy from 'lodash/orderBy'
import { MultiChainName, multiChainQueryMainToken, multiChainQueryEndPoint } from '../../constant'

const getPriceSubqueries = (chainName: MultiChainName, tokenAddress: string, blocks: any) =>
  blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derived${multiChainQueryMainToken[chainName]}
      }
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
        ${multiChainQueryMainToken[chainName].toLowerCase()}Price
      }
    `,
  )

/**
 * Price data for token and bnb based on block number
 */
const priceQueryConstructor = (subqueries: string[]) => {
  return gql`
    query tokenPriceData {
      ${subqueries}
    }
  `
}

const fetchTokenPriceData = async (
  chainName: MultiChainName,
  address: string,
  interval: number,
  startTimestamp: number,
): Promise<{
  data?: PriceChartEntry[]
  error: boolean
}> => {
  // Construct timestamps to query against
  const endTimestamp = getUnixTime(new Date())
  const timestamps = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }
  try {
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks for timestamps', timestamps)
      return {
        error: false,
      }
    }

    const prices: any | undefined = await multiQuery(
      priceQueryConstructor,
      getPriceSubqueries(chainName, address, blocks),
      multiChainQueryEndPoint[chainName],
      200,
    )

    console.warn('fetchTokenPriceData', { chainName, prices })

    if (!prices) {
      console.error('Price data failed to load')
      return {
        error: false,
      }
    }

    // format token BNB price results
    const tokenPrices: {
      timestamp: string
      derivedBNB: number
      priceUSD: number
    }[] = []

    const mainToken = multiChainQueryMainToken[chainName]

    // Get Token prices in BNB
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('t')[1]
      // if its BNB price e.g. `b123` split('t')[1] will be undefined and skip BNB price entry
      if (timestamp) {
        tokenPrices.push({
          timestamp,
          derivedBNB: prices[priceKey]?.[`derived${mainToken}`]
            ? parseFloat(prices[priceKey][`derived${mainToken}`])
            : 0,
          priceUSD: 0,
        })
      }
    })

    console.warn('pricesPart1', tokenPrices)

    // Go through BNB USD prices and calculate Token price based on it
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('b')[1]
      // if its Token price e.g. `t123` split('b')[1] will be undefined and skip Token price entry
      if (timestamp) {
        const tokenPriceIndex = tokenPrices.findIndex((tokenPrice) => tokenPrice.timestamp === timestamp)
        if (tokenPriceIndex >= 0) {
          const { derivedBNB } = tokenPrices[tokenPriceIndex]
          tokenPrices[tokenPriceIndex].priceUSD =
            parseFloat(prices[priceKey]?.[`${mainToken.toLowerCase()}Price`] ?? 0) * derivedBNB
        }
      }
    })

    // graphql-request does not guarantee same ordering of batched requests subqueries, hence sorting by timestamp from oldest to newest
    const sortedTokenPrices = orderBy(tokenPrices, (tokenPrice) => parseInt(tokenPrice.timestamp, 10))

    const formattedHistory = []

    // for each timestamp, construct the open and close price
    for (let i = 0; i < sortedTokenPrices.length - 1; i++) {
      formattedHistory.push({
        time: parseFloat(sortedTokenPrices[i].timestamp),
        open: sortedTokenPrices[i].priceUSD,
        close: sortedTokenPrices[i + 1].priceUSD,
        high: sortedTokenPrices[i + 1].priceUSD,
        low: sortedTokenPrices[i].priceUSD,
      })
    }

    return { data: formattedHistory, error: false }
  } catch (error) {
    console.error(`Failed to fetch price data for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchTokenPriceData
