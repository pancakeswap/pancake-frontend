import { toBigInt } from '@pancakeswap/utils/toBigInt'

import { GetGasLimitParams, getDefaultGasBuffer, getGasLimit } from './getGasLimit'
import { MulticallRequestWithGas } from './types'
import { getMulticallContract } from './getMulticallContract'
import { getBlockConflictTolerance } from './getBlockConflictTolerance'

export type CallByGasLimitParams = GetGasLimitParams & {
  // Normally we expect to get quotes from within the same block
  // But for some chains like BSC the block time is quite short so need some extra tolerance
  // 0 means no block conflict and all the multicall results should be queried within the same block
  blockConflictTolerance?: number
}

export async function multicallByGasLimit(
  calls: MulticallRequestWithGas[],
  { chainId, gasBuffer = getDefaultGasBuffer(chainId), client, ...rest }: CallByGasLimitParams,
) {
  const gasLimit = await getGasLimit({
    chainId,
    gasBuffer,
    client,
    ...rest,
  })
  const callChunks = splitCallsIntoChunks(calls, gasLimit)
  return callByChunks(callChunks, { gasBuffer, client, chainId })
}

type CallParams = Pick<CallByGasLimitParams, 'chainId' | 'client' | 'gasBuffer' | 'blockConflictTolerance'>

export type SingleCallResult = {
  result: string
  gasUsed: bigint
  success: boolean
}

export type CallResult = {
  results: SingleCallResult[]
  // Will be the greatest block number if block conflict tolerance is not 0
  blockNumber: bigint
}

export type MulticallReturn = CallResult & {
  lastSuccessIndex: number
}

type CallReturnFromContract = [bigint, { success: boolean; gasUsed: bigint; returnData: string }[], bigint]

function formatCallReturn([blockNumber, results, successIndex]: CallReturnFromContract): MulticallReturn {
  const lastSuccessIndex = Number(successIndex)
  return {
    lastSuccessIndex,
    blockNumber,
    results: results.slice(0, lastSuccessIndex + 1).map(({ gasUsed, success, returnData }) => ({
      gasUsed,
      success,
      result: returnData,
    })),
  }
}

async function call(calls: MulticallRequestWithGas[], params: CallParams): Promise<CallResult> {
  const {
    chainId,
    client,
    gasBuffer = getDefaultGasBuffer(chainId),
    blockConflictTolerance = getBlockConflictTolerance(chainId),
  } = params
  if (!calls.length) {
    return {
      results: [],
      blockNumber: 0n,
    }
  }

  const contract = getMulticallContract({ chainId, client })
  const { result } = await contract.simulate.multicallWithGasLimitation([calls, gasBuffer])
  const { results, lastSuccessIndex, blockNumber } = formatCallReturn(result as CallReturnFromContract)
  if (lastSuccessIndex === calls.length - 1) {
    return {
      results,
      blockNumber,
    }
  }
  console.warn(
    `Gas limit reached. Total num of ${calls.length} calls. First ${
      lastSuccessIndex + 1
    } calls executed. The remaining ${
      calls.length - lastSuccessIndex - 1
    } calls are not executed. Pls try adjust the gas limit per call.`,
  )
  const { results: remainingResults, blockNumber: nextBlockNumber } = await call(
    calls.slice(lastSuccessIndex + 1),
    params,
  )
  if (Number(nextBlockNumber - blockNumber) > blockConflictTolerance) {
    throw new Error(
      `Multicall failed because of block conflict. Latest calls are made at block ${nextBlockNumber} while last calls made at block ${blockNumber}. Block conflict tolerance is ${blockConflictTolerance}`,
    )
  }
  return {
    results: [...results, ...remainingResults],
    // Use the latest block number
    blockNumber: nextBlockNumber,
  }
}

async function callByChunks(chunks: MulticallRequestWithGas[][], params: CallParams): Promise<CallResult> {
  const { blockConflictTolerance = getBlockConflictTolerance(params.chainId) } = params
  const callReturns = await Promise.all(chunks.map((chunk) => call(chunk, params)))

  let minBlock = 0n
  let maxBlock = 0n
  let results: SingleCallResult[] = []
  for (const { results: callResults, blockNumber } of callReturns) {
    if (minBlock === 0n || blockNumber < minBlock) {
      minBlock = blockNumber
    }
    if (blockNumber > maxBlock) {
      maxBlock = blockNumber
    }
    if (Number(maxBlock - minBlock) > blockConflictTolerance) {
      throw new Error(
        `Multicall failed because of block conflict. Min block is ${minBlock} while max block is ${maxBlock}. Block conflict tolerance is ${blockConflictTolerance}`,
      )
    }
    results = [...results, ...callResults]
  }
  return {
    results,
    blockNumber: maxBlock,
  }
}

function splitCallsIntoChunks(calls: MulticallRequestWithGas[], gasLimit: bigint): MulticallRequestWithGas[][] {
  const chunks: MulticallRequestWithGas[][] = [[]]

  let gasLeft = gasLimit
  for (const callRequest of calls) {
    const { target, callData, gasLimit: gasCostLimit } = callRequest
    const singleGasLimit = toBigInt(gasCostLimit)
    const currentChunk = chunks[chunks.length - 1]
    if (singleGasLimit > gasLeft) {
      chunks.push([callRequest])
      gasLeft = gasLimit - singleGasLimit

      // Single call exceeds the gas limit
      if (gasLeft < 0n) {
        console.warn(
          `Multicall request may fail as the gas cost of a single call exceeds the gas limit ${gasLimit}. Gas cost: ${singleGasLimit}. To: ${target}. Data: ${callData}`,
        )
      }
      continue
    }

    currentChunk.push(callRequest)
    gasLeft -= singleGasLimit
  }

  return chunks
}
