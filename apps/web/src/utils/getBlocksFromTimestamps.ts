import { gql } from 'graphql-request'
import orderBy from 'lodash/orderBy'
import { multiChainBlocksClient, multiChainName, MultiChainNameExtend } from 'state/info/constant'
import { ChainId, getLlamaChainName } from '@pancakeswap/chains'
import { Block } from 'state/info/types'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'

const getBlockSubqueries = (timestamps: number[]) =>
  timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
  })

const blocksQueryConstructor = (subqueries: string[]) => {
  return gql`query blocks {
    ${subqueries}
  }`
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 * @param sortDirection The direction to sort the retrieved blocks. Defaults to 'desc'
 * @param skipCount How many subqueries to fire at a time
 * @param chainName The name of the blockchain to retrieve blocks from. Defaults to 'BSC'
 */
export const getBlocksFromTimestamps = async (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  skipCount: number | undefined = 500,
  chainName: MultiChainNameExtend | undefined = 'BSC',
): Promise<Block[]> => {
  if (timestamps?.length === 0) {
    return []
  }

  if (chainName === 'ZKSYNC') {
    const chainId = Object.entries(multiChainName).find(([, value]) => value === chainName)?.[0]
    const llamaChainName = chainId && getLlamaChainName(chainId as unknown as ChainId)
    const blocks = await timestamps.reduce(async (accumP, timestamp) => {
      const acc = await accumP
      try {
        const response = await fetch(`https://coins.llama.fi/block/${llamaChainName}/${timestamp}`)
        const height = await response.json().then((data) => data.height)
        if (height) {
          acc.push({
            timestamp: timestamp.toString(),
            number: parseInt(height, 10),
          })
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
      return acc
    }, Promise.resolve([] as Block[]))
    return orderBy(blocks, (block) => block.number, sortDirection)
  }
  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    multiChainBlocksClient[chainName],
    skipCount,
  )

  const blocks: Block[] = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(fetchedData)) {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: parseInt(fetchedData[key][0].number, 10),
        })
      }
    }
    // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
    return orderBy(blocks, (block) => block.number, sortDirection)
  }
  return blocks
}
