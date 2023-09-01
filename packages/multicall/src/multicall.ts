import { toBigInt } from '@pancakeswap/utils/toBigInt'

import { GetGasLimitParams, getDefaultGasBuffer, getGasLimit } from './getGasLimit'
import { MulticallRequestWithGas, MulticallRequest } from './types'
import { getMulticallContract } from './getMulticallContract'

export type CallByGasLimitParams = GetGasLimitParams

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
  const resultChunks = await callByChunks(callChunks, { gasBuffer, client, chainId })
  return resultChunks.reduce<string[]>((acc, cur) => [...acc, ...cur], [])
}

type CallParams = Pick<CallByGasLimitParams, 'chainId' | 'client' | 'gasBuffer'>

type CallReturn = {
  results: string[]
  lastSuccessIndex: number
}

async function call(
  calls: MulticallRequest[],
  { chainId, client, gasBuffer = getDefaultGasBuffer(chainId) }: CallParams,
): Promise<CallReturn> {
  if (!calls.length) {
    return {
      results: [],
      lastSuccessIndex: 0,
    }
  }

  const contract = getMulticallContract({ chainId, client })
  const { result } = await contract.simulate.multicallWithGasLimitation([calls, gasBuffer])
  const [results, lastSuccessIndex] = result as [string[], bigint]
  return { results, lastSuccessIndex: Number(lastSuccessIndex) }
}

async function callByChunks(chunks: MulticallRequest[][], params: CallParams): Promise<string[][]> {
  const callReturns = await Promise.all(chunks.map((chunk) => call(chunk, params)))

  const resultChunks: string[][] = []
  const remainingChunks: MulticallRequest[][] = []
  for (const [index, callReturn] of callReturns.entries()) {
    const chunkSize = chunks[index].length
    const { results, lastSuccessIndex } = callReturn
    resultChunks.push(results)
    remainingChunks.push(chunks[index].slice(lastSuccessIndex + 1, chunkSize))
  }

  if (remainingChunks.every((chunk) => chunk.length === 0)) {
    return resultChunks
  }
  console.warn(
    `Gas limit reached. Some of the multicalls doesn't get executed. Pls try adjust the gas limit per call. Chunks tried ${chunks}. Remaining chunks ${remainingChunks}`,
  )
  const remainingResults = await callByChunks(remainingChunks, params)
  for (const [index, results] of remainingResults.entries()) {
    resultChunks[index] = [...resultChunks[index], ...results]
  }
  return resultChunks
}

function splitCallsIntoChunks(calls: MulticallRequestWithGas[], gasLimit: bigint): MulticallRequest[][] {
  const chunks: MulticallRequest[][] = [[]]

  let gasLeft = gasLimit
  for (const { to, data, gas: gasCost } of calls) {
    const gas = toBigInt(gasCost)
    const currentChunk = chunks[chunks.length - 1]
    const callRequest = { to, data }
    if (gas > gasLeft) {
      chunks.push([callRequest])
      gasLeft = gasLimit - gas

      // Single call exceeds the gas limit
      if (gasLeft < 0n) {
        console.warn(
          `Multicall request may fail as the gas cost of a single call exceeds the gas limit ${gasLimit}. Gas cost: ${gas}. To: ${to}. Data: ${data}`,
        )
      }
      continue
    }

    currentChunk.push(callRequest)
    gasLeft -= gas
  }

  return chunks
}
