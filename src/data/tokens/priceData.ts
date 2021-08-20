import { getUnixTime } from 'date-fns'
import gql from 'graphql-tag'
import { client } from 'config/apolloClient'
import { getBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { splitQuery } from 'utils/infoQueryHelpers'
import { PriceChartEntry } from 'types'

/**
 * Price data for token and bnb based on block number
 */
export const PRICES_BY_BLOCK = (tokenAddress: string, blocks: any) => {
  let queryString = 'query tokenPriceData {'
  queryString += blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derivedBNB
      }
    `,
  )
  queryString += ','
  queryString += blocks.map(
    (block: any) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
        bnbPrice
      }
    `,
  )

  queryString += '}'
  return gql(queryString)
}

export async function fetchTokenPriceData(
  address: string,
  interval: number,
  startTimestamp: number,
): Promise<{
  data: PriceChartEntry[]
  error: boolean
}> {
  // start and end bounds

  try {
    const endTimestamp = getUnixTime(new Date())

    if (!startTimestamp) {
      console.error('Error constructing price start timestamp')
      return {
        data: [],
        error: false,
      }
    }

    // create an array of hour start times until we reach current hour
    const timestamps = []
    let time = startTimestamp
    while (time <= endTimestamp) {
      timestamps.push(time)
      time += interval
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return {
        data: [],
        error: false,
      }
    }

    // fetch blocks based on timestamp
    const blocks = await getBlocksFromTimestamps(timestamps, 500)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks')
      return {
        data: [],
        error: false,
      }
    }

    const prices: any | undefined = await splitQuery(PRICES_BY_BLOCK, client, [address], blocks, 200)
    const pricesCopy = Object.assign([], prices)

    if (prices && pricesCopy) {
      // format token ETH price results
      const values: {
        timestamp: string
        derivedBNB: number | undefined
        priceUSD: number
      }[] = []

      // TODO PCS fix this shit
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const row in prices) {
        const timestamp = row.split('t')[1]
        const derivedBNB = prices[row]?.derivedBNB ? parseFloat(prices[row]?.derivedBNB) : undefined
        if (timestamp && derivedBNB) {
          values.push({
            timestamp,
            derivedBNB,
            priceUSD: 0,
          })
        }
      }

      // go through eth usd prices and assign to original values array
      let index = 0
      // TODO PCS fix this shit
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const brow in pricesCopy) {
        const timestamp = brow.split('b')[1]
        const derivedBNB = values[index]?.derivedBNB
        if (timestamp && derivedBNB) {
          values[index].priceUSD = parseFloat(pricesCopy[brow]?.bnbPrice ?? 0) * derivedBNB
          index += 1
        }
      }

      const formattedHistory = []

      // for each hour, construct the open and close price
      for (let i = 0; i < values.length - 1; i++) {
        formattedHistory.push({
          time: parseFloat(values[i].timestamp),
          open: values[i].priceUSD,
          close: values[i + 1].priceUSD,
          high: values[i + 1].priceUSD,
          low: values[i].priceUSD,
        })
      }

      return { data: formattedHistory, error: false }
    }
    console.info('no price data loaded')
    return {
      data: [],
      error: false,
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
      error: true,
    }
  }
}
