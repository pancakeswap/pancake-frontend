import { ChainId } from '@pancakeswap/chains'
import { getMulticall3ContractAddress, multicall3ABI } from '@pancakeswap/multicall'
import { getViemClients } from 'utils/viem'
import { Call } from './actions'
import { RetryableError } from './retry'

const l2DifferentBlockNumberChains = [
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.OPBNB_TESTNET,
  ChainId.OPBNB,
]

export type FetchChunkResult = ReturnType<typeof fetchChunk>

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param chainId
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
export async function fetchChunk(
  chainId: number,
  chunk: Call[],
  minBlockNumber: number,
): Promise<{ results: any[]; blockNumber: number }> {
  console.debug('Fetching chunk', chainId, chunk, minBlockNumber)
  let resultsBlockNumber: bigint | undefined
  let returnData: any
  const client = getViemClients({ chainId })
  try {
    // prettier-ignore
    [resultsBlockNumber, , returnData] = await client.readContract({
      abi: multicall3ABI,
      address: getMulticall3ContractAddress(chainId),
      functionName: 'tryBlockAndAggregate',
      args: [false, chunk.map((obj) => ({ callData: obj.callData, target: obj.address }))],
      blockNumber: BigInt(minBlockNumber),
    })
  } catch (err) {
    const error = err as any
    if (
      error.code === -32000 ||
      (error?.data?.message && error?.data?.message?.indexOf('header not found') !== -1) ||
      error.message?.indexOf('header not found') !== -1
    ) {
      throw new RetryableError(`header not found for block number ${minBlockNumber}`)
    } else if (error.code === -32603 || error.message?.indexOf('execution ran out of gas') !== -1) {
      if (chunk.length > 1) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Splitting a chunk in 2', chunk)
        }
        const half = Math.floor(chunk.length / 2)
        const [c0, c1] = await Promise.all([
          fetchChunk(chainId, chunk.slice(0, half), minBlockNumber),
          fetchChunk(chainId, chunk.slice(half, chunk.length), minBlockNumber),
        ])
        return {
          results: c0.results.concat(c1.results),
          blockNumber: c1.blockNumber,
        }
      }
    }
    console.debug('Failed to fetch chunk inside retry', error)
    throw error
  }

  const l2DifferentBlockNumber = l2DifferentBlockNumberChains.includes(chainId)

  if (Number(resultsBlockNumber) < minBlockNumber && !l2DifferentBlockNumber) {
    console.debug(`Fetched results for old block number: ${resultsBlockNumber?.toString()} vs. ${minBlockNumber}`)
  }

  return {
    results: returnData,
    blockNumber: l2DifferentBlockNumber ? minBlockNumber : Number(resultsBlockNumber),
  }
}
