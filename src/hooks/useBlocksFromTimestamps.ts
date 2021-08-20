import gql from 'graphql-tag'
import { useState, useEffect, useMemo } from 'react'
import { splitQuery } from 'utils/queries'
import { blockClient } from 'config/apolloClient'

export const GET_BLOCKS = (timestamps: string[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
        number
      }`
  })
  queryString += '}'
  return gql(queryString)
}

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export const useBlocksFromTimestamps = (
  timestamps: number[],
): {
  blocks:
    | {
        timestamp: string
        number: any
      }[]
    | undefined
  error: boolean
} => {
  const [blocks, setBlocks] = useState<any>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const results = await splitQuery(GET_BLOCKS, blockClient, [], timestamps)
      if (results) {
        setBlocks(results)
      } else {
        setError(true)
      }
    }
    if (!blocks && !error) {
      fetchData()
    }
  })

  const blocksFormatted = useMemo(() => {
    if (blocks) {
      const formatted = []
      // eslint-disable-next-line no-restricted-syntax
      for (const t in blocks) {
        if (blocks[t].length > 0) {
          formatted.push({
            timestamp: t.split('t')[1],
            number: parseInt(blocks[t][0].number, 10),
          })
        }
      }
      return formatted
    }
    return undefined
  }, [blocks])

  return {
    blocks: blocksFormatted,
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
  const fetchedData: any = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)

  const blocks: any[] = []
  if (fetchedData) {
    // TODO rewrite loop
    // eslint-disable-next-line no-restricted-syntax
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0].number,
        })
      }
    }
  }
  return blocks
}
