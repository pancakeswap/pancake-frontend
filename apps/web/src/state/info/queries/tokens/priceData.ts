import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import orderBy from 'lodash/orderBy'

import { PriceChartEntry } from 'state/info/types'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import { MultiChainName, checkIsStableSwap, getMultiChainQueryEndPointWithStableSwap } from '../../constant'

interface FormattedHistory {
  time: number
  open: number
  close: number
  high: number
  low: number
}

const getPriceSubqueries = (chainName: MultiChainName, tokenAddress: string, blocks: any) =>
  blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
        derivedETH
      }
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
        ethPrice
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
  const endTimestamp = dayjs().unix()
  const timestamps: number[] = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }
  try {
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)
    const blocksLength = blocks?.length ?? 0
    if (blocksLength > 0 && chainName === 'BSC' && !checkIsStableSwap()) {
      const data = blocks[blocksLength - 1]
      blocks[blocksLength - 1] = { timestamp: data.timestamp, number: data.number - 32 }
      // nodeReal will sync the 32 block before latest
    }
    if (!blocks || blocksLength === 0) {
      console.error('Error fetching blocks for timestamps', timestamps)
      return {
        error: false,
      }
    }

    const prices: any | undefined = await multiQuery(
      priceQueryConstructor,
      getPriceSubqueries(chainName, address, blocks),
      getMultiChainQueryEndPointWithStableSwap(chainName),
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

    // Get Token prices in BNB
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('t')[1]
      // if its BNB price e.g. `b123` split('t')[1] will be undefined and skip BNB price entry
      if (timestamp) {
        tokenPrices.push({
          timestamp,
          derivedBNB: prices[priceKey]?.derivedETH ? parseFloat(prices[priceKey].derivedETH) : 0,
          priceUSD: 0,
        })
      }
    })

    // Go through BNB USD prices and calculate Token price based on it
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('b')[1]
      // if its Token price e.g. `t123` split('b')[1] will be undefined and skip Token price entry
      if (timestamp) {
        const tokenPriceIndex = tokenPrices.findIndex((tokenPrice) => tokenPrice.timestamp === timestamp)
        if (tokenPriceIndex >= 0) {
          const { derivedBNB } = tokenPrices[tokenPriceIndex]
          tokenPrices[tokenPriceIndex].priceUSD = parseFloat(prices[priceKey]?.ethPrice ?? 0) * derivedBNB
        }
      }
    })

    // graphql-request does not guarantee same ordering of batched requests subqueries, hence sorting by timestamp from oldest to newest
    const sortedTokenPrices = orderBy(tokenPrices, (tokenPrice) => parseInt(tokenPrice.timestamp, 10))

    const formattedHistory: FormattedHistory[] = []

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
