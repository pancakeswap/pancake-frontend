import orderBy from 'lodash/orderBy'
import { explorerApiClient } from 'state/info/api/client'
import { MultiChainNameExtend, infoChainNameToExplorerChainName } from 'state/info/constant'
import { Block } from 'state/info/types'

/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 * @param sortDirection The direction to sort the retrieved blocks. Defaults to 'desc'
 * @param chainName The name of the blockchain to retrieve blocks from. Defaults to 'BSC'
 */
export const getBlocksFromTimestamps = async (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  chainName: MultiChainNameExtend | undefined = 'BSC',
): Promise<Block[]> => {
  if (timestamps?.length === 0) {
    return []
  }

  const explorerChainName = infoChainNameToExplorerChainName[chainName]

  if (!explorerChainName) {
    throw new Error('Invalid chain name')
  }

  const blocks = await timestamps.reduce(async (accumP, timestamp) => {
    const acc = await accumP
    try {
      const response = await explorerApiClient.GET('/cached/block/{chainName}/{timestamp}', {
        params: {
          path: {
            chainName: explorerChainName,
            timestamp,
          },
        },
      })
      const height = response.data?.height
      if (height) {
        acc.push({
          timestamp: timestamp.toString(),
          number: height,
        })
      }
    } catch (error) {
      console.error('Unable to fetch data:', error)
    }
    return acc
  }, Promise.resolve([] as Block[]))
  return orderBy(blocks, (block) => block.number, sortDirection)
}
