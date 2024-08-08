import { useDebounce } from '@pancakeswap/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCurrentBlock } from 'hooks/useCurrentBlockTimestamp'
import { useWorker } from 'hooks/useWorker'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { MulticallState, multicallReducerAtom } from 'state/multicall/reducer'

import { useMulticallContract } from 'hooks/useContract'
import {
  Call,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  parseCallKey,
  updateMulticallResults,
} from './actions'
import chunkArray from './chunkArray'
import { CancelledError, retry } from './retry'

// chunk calls so we do not exceed the gas limit
const CALL_CHUNK_SIZE = 500

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: MulticallState['callListeners'],
  chainId?: number,
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {}
  const listeners = allListeners[chainId]
  if (!listeners) return {}

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>((memo, callKey) => {
    const keyListeners = listeners[callKey]

    memo[callKey] = Object.keys(keyListeners)
      .filter((key) => {
        const blocksPerFetch = parseInt(key)
        if (blocksPerFetch <= 0) return false
        return keyListeners[blocksPerFetch] > 0
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current))
      }, Infinity)
    return memo
  }, {})
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param currentBlock the latest block number
 */
export function outdatedListeningKeys(
  callResults: MulticallState['callResults'],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  currentBlock: number | undefined,
): string[] {
  if (!chainId || !currentBlock) return []
  const results = callResults[chainId]
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys)

  return Object.keys(listeningKeys).filter((callKey) => {
    const data = callResults[chainId][callKey]
    // no data, must fetch
    if (!data) return true

    const blocksPerFetch = listeningKeys[callKey]
    const minDataBlockNumber = currentBlock - (blocksPerFetch - 1)

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber
  })
}

export default function Updater(): null {
  const [state, dispatch] = useAtom(multicallReducerAtom)
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100)
  const currentBlock = useCurrentBlock()
  const { chainId } = useActiveChainId()
  const multicallContract = useMulticallContract()
  const cancellations = useRef<{ blockNumber: number; cancellations: (() => void)[] }>()
  const worker = useWorker()

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId)
  }, [debouncedListeners, chainId])

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(state.callResults, listeningKeys, chainId, currentBlock)
  }, [chainId, state.callResults, listeningKeys, currentBlock])

  const serializedOutdatedCallKeys = useMemo(
    () => JSON.stringify(unserializedOutdatedCallKeys.sort()),
    [unserializedOutdatedCallKeys],
  )

  useEffect(() => {
    if (!worker || !currentBlock || !chainId || !multicallContract) return

    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys)
    if (outdatedCallKeys.length === 0) return
    const calls = outdatedCallKeys.map((key) => parseCallKey(key))

    const chunkedCalls = chunkArray(calls, CALL_CHUNK_SIZE)

    if (cancellations.current?.blockNumber !== currentBlock) {
      cancellations.current?.cancellations?.forEach((c) => c())
    }

    dispatch(
      fetchingMulticallResults({
        calls,
        chainId,
        fetchingBlockNumber: currentBlock,
      }),
    )

    cancellations.current = {
      blockNumber: currentBlock,
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(
          () =>
            worker.fetchChunk({
              chainId,
              chunk,
              minBlockNumber: currentBlock,
            }),
          {
            n: Infinity,
            minWait: 2500,
            maxWait: 3500,
          },
        )
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }: any) => {
            cancellations.current = { cancellations: [], blockNumber: currentBlock }

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls.slice(0, index).reduce<number>((memo, curr) => memo + curr.length, 0)
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length

            const { erroredCalls, results } = outdatedCallKeys.slice(firstCallKeyIndex, lastCallKeyIndex).reduce<{
              erroredCalls: Call[]
              results: { [callKey: string]: string | null }
            }>(
              (memo, callKey, i) => {
                if (returnData[i].success) {
                  memo.results[callKey] = returnData[i].returnData ?? null
                } else {
                  memo.erroredCalls.push(parseCallKey(callKey))
                }
                return memo
              },
              { erroredCalls: [], results: {} },
            )

            if (Object.keys(results).length > 0) {
              dispatch(
                updateMulticallResults({
                  chainId,
                  results,
                  blockNumber: fetchBlockNumber,
                }),
              )
            }

            if (erroredCalls.length > 0) {
              dispatch(
                errorFetchingMulticallResults({
                  calls: erroredCalls,
                  chainId,
                  fetchingBlockNumber: fetchBlockNumber,
                }),
              )
            }
          })
          .catch((error: any) => {
            const REVERT_STR = 'revert exception'

            // when revert error, should not update new state and keep current state.
            if (error instanceof CancelledError || error?.message?.indexOf(REVERT_STR) >= 0) {
              console.debug('Cancelled fetch for blockNumber', currentBlock)
              return
            }
            console.error('Failed to fetch multicall chunk', chunk, chainId, error, currentBlock)
            dispatch(
              errorFetchingMulticallResults({
                calls: chunk,
                chainId,
                fetchingBlockNumber: currentBlock,
              }),
            )
          })
        return cancel
      }),
    }
  }, [worker, chainId, multicallContract, dispatch, serializedOutdatedCallKeys, currentBlock])

  return null
}
