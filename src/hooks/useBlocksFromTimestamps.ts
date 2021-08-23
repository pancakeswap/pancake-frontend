import { gql } from 'graphql-request'
import { useState, useEffect } from 'react'
import { multiQuery } from 'utils/infoQueryHelpers'
import { BLOCKS_CLIENT } from 'config/constants/endpoints'
import { Block } from 'state/info/types'

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
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export const useBlocksFromTimestamps = (
  timestamps: number[],
): {
  blocks?: Block[]
  error: boolean
} => {
  const [blocks, setBlocks] = useState<Block[]>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const results = await multiQuery(blocksQueryConstructor, getBlockSubqueries(timestamps), BLOCKS_CLIENT)
      if (results) {
        const formattedBlocks = []
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(results)) {
          if (results[key].length > 0) {
            formattedBlocks.push({
              timestamp: key.split('t')[1],
              number: parseInt(results[key][0].number, 10),
            })
          }
        }
        // graphql-request does not guarantee same ordering of batched requests subqueries, hence sorting by blocks from recent to oldest
        formattedBlocks.sort((a, b) => b.number - a.number)
        setBlocks(formattedBlocks)
      } else {
        setError(true)
      }
    }
    if (!blocks && !error) {
      fetchData()
    }
  }) // TODO: dep array?

  return {
    blocks,
    error,
  }
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export const getBlocksFromTimestamps = async (timestamps: number[], skipCount = 500) => {
  if (timestamps?.length === 0) {
    return []
  }
  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    BLOCKS_CLIENT,
    skipCount,
  )

  const blocks: any[] = []
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
    blocks.sort((a, b) => a.number - b.number)
  }
  return blocks
}
