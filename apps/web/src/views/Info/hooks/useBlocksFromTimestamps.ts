import { useEffect, useState } from 'react'
import { multiChainId, multiChainName, MultiChainNameExtend } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { Block } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'

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
  const chainName = useChainNameByQuery()

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
    if (!blocksArray && !error && chainName) {
      fetchData()
    }
  }, [blocksString, error, skipCount, sortDirection, timestampsString, chainName])

  return {
    blocks,
    error,
  }
}

export const useBlockFromTimeStampSWR = (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  skipCount: number | undefined = 1000,
  targetChainName?: MultiChainNameExtend,
) => {
  const chainNameByQuery = useChainNameByQuery()
  const chainName = targetChainName ?? chainNameByQuery
  const chainId = multiChainId[chainName]
  const timestampsString = JSON.stringify(timestamps)
  const timestampsArray = JSON.parse(timestampsString)
  const { data } = useSWRImmutable(
    [`info/blocks/${timestampsString}/${chainId}`, multiChainName[chainId] ?? chainName],
    () => getBlocksFromTimestamps(timestampsArray, sortDirection, skipCount, chainName),
  )
  return { blocks: data }
}
