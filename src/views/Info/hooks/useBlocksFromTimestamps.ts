import { useState, useEffect } from 'react'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { Block } from 'state/info/types'
import { useGetChainName } from 'state/info/hooks'

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 * @param sortDirection
 * @param skipCount
 */
export const useBlocksFromTimestamps = (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' = 'desc',
  skipCount = 1000,
): {
  blocks?: Block[]
  error: boolean
} => {
  const [blocks, setBlocks] = useState<Block[]>()
  const [error, setError] = useState(false)

  const timestampsString = JSON.stringify(timestamps)
  const blocksString = blocks ? JSON.stringify(blocks) : undefined
  const chainName = useGetChainName()

  useEffect(() => {
    const fetchData = async () => {
      const timestampsArray = JSON.parse(timestampsString)
      const result = await getBlocksFromTimestamps(timestampsArray, sortDirection, skipCount, chainName)
      if (result.length === 0) {
        setError(true)
      } else {
        setBlocks(result)
      }
    }
    const blocksArray = blocksString ? JSON.parse(blocksString) : undefined
    if (!blocksArray && !error) {
      fetchData()
    }
  }, [blocksString, error, skipCount, sortDirection, timestampsString, chainName])

  return {
    blocks,
    error,
  }
}
