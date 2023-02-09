/* eslint-disable no-console, @typescript-eslint/no-shadow, @typescript-eslint/no-non-null-assertion, prefer-destructuring, camelcase, consistent-return, no-await-in-loop, no-lonely-if, @typescript-eslint/no-unused-vars */
import { ChainId, JSBI } from '@pancakeswap/sdk'
import { BaseProvider } from '@ethersproject/providers'
import { Interface } from '@ethersproject/abi'
import chunk from 'lodash/chunk'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import flatMap from 'lodash/flatMap'
import filter from 'lodash/filter'
import retry, { Options as RetryOptions } from 'async-retry'
import stats from 'stats-lite'

import { BaseRoute, OnChainProvider, QuoteProvider, RouteWithoutQuote, RouteWithQuote } from '../types'
import IMixedRouteQuoterV1ABI from '../../abis/IMixedRouteQuoterV1.json'
import IQuoterV2ABI from '../../abis/IQuoterV2.json'
import { encodeMixedRouteToPath } from '../utils'
import { Result } from './multicallProvider'
import { UniswapMulticallProvider } from './multicallSwapProvider'

const DEFAULT_BATCH_RETRIES = 2

interface FactoryConfig {
  getQuoterAddress: (chainId: ChainId) => string
  contractInterface: Interface
  getQuoteFunctionName: (isExactIn: boolean) => string
}

interface ProviderConfig {
  onChainProvider: OnChainProvider
}

type QuoteBatchSuccess = {
  status: 'success'
  inputs: [string, string][]
  results: {
    blockNumber: JSBI
    results: Result<[JSBI, JSBI[], number[], JSBI]>[]
    approxGasUsedPerSuccessCall: number
  }
}

type QuoteBatchFailed = {
  status: 'failed'
  inputs: [string, string][]
  reason: Error
  results?: {
    blockNumber: JSBI
    results: Result<[JSBI, JSBI[], number[], JSBI]>[]
    approxGasUsedPerSuccessCall: number
  }
}

type QuoteBatchPending = {
  status: 'pending'
  inputs: [string, string][]
}

type QuoteBatchState = QuoteBatchSuccess | QuoteBatchFailed | QuoteBatchPending

export class BlockConflictError extends Error {
  public name = 'BlockConflictError'
}

export class SuccessRateError extends Error {
  public name = 'SuccessRateError'
}

export class ProviderBlockHeaderError extends Error {
  public name = 'ProviderBlockHeaderError'
}

export class ProviderTimeoutError extends Error {
  public name = 'ProviderTimeoutError'
}

/**
 * This error typically means that the gas used by the multicall has
 * exceeded the total call gas limit set by the node provider.
 *
 * This can be resolved by modifying BatchParams to request fewer
 * quotes per call, or to set a lower gas limit per quote.
 *
 * @export
 * @class ProviderGasError
 */
export class ProviderGasError extends Error {
  public name = 'ProviderGasError'
}

export type QuoteRetryOptions = RetryOptions

function onChainQuoteProviderFactory({ getQuoteFunctionName, getQuoterAddress, contractInterface }: FactoryConfig) {
  return function createOnChainQuoteProvider({ onChainProvider }: ProviderConfig): QuoteProvider {
    const createGetRoutesWithQuotes = (isExactIn = true) => {
      const encodeRouteToPath = (route: BaseRoute) => encodeMixedRouteToPath(route, !isExactIn)
      const functionName = getQuoteFunctionName(isExactIn)

      return async function getRoutesWithQuote(routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> {
        if (!routes.length) {
          return []
        }
        const chainId: ChainId = routes[0].amount.currency.chainId
        const chainProvider = onChainProvider({ chainId })
        let multicallChunk = 150
        let gasLimitOverride = 1_000_000
        const gasErrorFailureOverride = {
          gasLimitOverride: 1_500_000,
          multicallChunk: 100,
        }
        const successRateFailureOverrides = {
          gasLimitOverride: 1_300_000,
          multicallChunk: 110,
        }
        const retryOptions = {
          retries: DEFAULT_BATCH_RETRIES,
          minTimeout: 25,
          maxTimeout: 250,
        }
        const providerConfig = { blockNumber: 0 }
        // const baseBlockOffset = 0
        const rollback = { enabled: false, rollbackBlockOffset: 0, attemptsBeforeRollback: 2 }
        const multicall2Provider = new UniswapMulticallProvider(
          chainId,
          chainProvider as BaseProvider,
          gasLimitOverride,
        )

        const inputs = routes.map<[string, string]>((route) => [
          encodeRouteToPath({
            pools: route.pools,
            path: route.path,
            type: route.type,
            input: route.amount.currency,
          }),
          `0x${route.amount.quotient.toString(16)}`,
        ])

        const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))
        const inputsChunked = chunk(inputs, normalizedChunk)
        let quoteStates: QuoteBatchState[] = map(inputsChunked, (inputChunk) => {
          return {
            status: 'pending',
            inputs: inputChunk,
          }
        })

        let haveRetriedForSuccessRate = false
        let haveRetriedForBlockHeader = false
        let blockHeaderRetryAttemptNumber = 0
        let haveIncrementedBlockHeaderFailureCounter = false
        let blockHeaderRolledBack = false
        let haveRetriedForBlockConflictError = false
        let haveRetriedForOutOfGas = false
        let haveRetriedForTimeout = false
        let haveRetriedForUnknownReason = false
        let finalAttemptNumber = 1
        const expectedCallsMade = quoteStates.length
        let totalCallsMade = 0

        const {
          results: quoteResults,
          blockNumber,
          approxGasUsedPerSuccessCall,
        } = await retry(
          async (_bail, attemptNumber) => {
            haveIncrementedBlockHeaderFailureCounter = false
            finalAttemptNumber = attemptNumber

            const [success, failed, pending] = partitionQuotes(quoteStates)

            console.log(
              `Starting attempt: ${attemptNumber}.
          Currently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
          Gas limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`,
            )

            quoteStates = await Promise.all(
              map(quoteStates, async (quoteState: QuoteBatchState, idx: number) => {
                if (quoteState.status === 'success') {
                  return quoteState
                }

                // QuoteChunk is pending or failed, so we try again
                const { inputs } = quoteState

                try {
                  totalCallsMade += 1

                  const results = await multicall2Provider.callSameFunctionOnContractWithMultipleParams<
                    [string, string],
                    [JSBI, JSBI[], number[], JSBI] // amountIn/amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate
                  >({
                    address: getQuoterAddress(chainId),
                    contractInterface,
                    functionName,
                    functionParams: inputs,
                    additionalConfig: {
                      gasLimitPerCallOverride: gasLimitOverride,
                    },
                  })

                  const successRateError = validateSuccessRate(results.results, haveRetriedForSuccessRate, 0.2)

                  if (successRateError) {
                    return {
                      status: 'failed',
                      inputs,
                      reason: successRateError,
                      results,
                    } as QuoteBatchFailed
                  }

                  return {
                    status: 'success',
                    inputs,
                    results,
                  } as QuoteBatchSuccess
                } catch (err: any) {
                  // Error from providers have huge messages that include all the calldata and fill the logs.
                  // Catch them and rethrow with shorter message.
                  if (err.message.includes('header not found')) {
                    return {
                      status: 'failed',
                      inputs,
                      reason: new ProviderBlockHeaderError(err.message.slice(0, 500)),
                    } as QuoteBatchFailed
                  }

                  if (err.message.includes('timeout')) {
                    return {
                      status: 'failed',
                      inputs,
                      reason: new ProviderTimeoutError(
                        `Req ${idx}/${quoteStates.length}. Request had ${inputs.length} inputs. ${err.message.slice(
                          0,
                          500,
                        )}`,
                      ),
                    } as QuoteBatchFailed
                  }

                  if (err.message.includes('out of gas')) {
                    return {
                      status: 'failed',
                      inputs,
                      reason: new ProviderGasError(err.message.slice(0, 500)),
                    } as QuoteBatchFailed
                  }

                  return {
                    status: 'failed',
                    inputs,
                    reason: new Error(`Unknown error from provider: ${err.message.slice(0, 500)}`),
                  } as QuoteBatchFailed
                }
              }),
            )

            const [successfulQuoteStates, failedQuoteStates, pendingQuoteStates] = partitionQuotes(quoteStates)

            if (pendingQuoteStates.length > 0) {
              throw new Error('Pending quote after waiting for all promises.')
            }

            let retryAll = false

            const blockNumberError = validateBlockNumbers(successfulQuoteStates, inputsChunked.length, gasLimitOverride)

            // If there is a block number conflict we retry all the quotes.
            if (blockNumberError) {
              retryAll = true
            }

            const reasonForFailureStr = map(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason.name).join(
              ', ',
            )

            if (failedQuoteStates.length > 0) {
              console.log(
                `On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`,
              )

              for (const failedQuoteState of failedQuoteStates) {
                const { reason: error } = failedQuoteState

                console.log({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`)

                if (error instanceof BlockConflictError) {
                  if (!haveRetriedForBlockConflictError) {
                    haveRetriedForBlockConflictError = true
                  }

                  retryAll = true
                } else if (error instanceof ProviderBlockHeaderError) {
                  if (!haveRetriedForBlockHeader) {
                    haveRetriedForBlockHeader = true
                  }

                  // Ensure that if multiple calls fail due to block header in the current pending batch,
                  // we only count once.
                  if (!haveIncrementedBlockHeaderFailureCounter) {
                    blockHeaderRetryAttemptNumber += 1
                    haveIncrementedBlockHeaderFailureCounter = true
                  }

                  if (rollback.enabled) {
                    const { rollbackBlockOffset, attemptsBeforeRollback } = rollback

                    if (blockHeaderRetryAttemptNumber >= attemptsBeforeRollback && !blockHeaderRolledBack) {
                      console.log(
                        `Attempt ${attemptNumber}. Have failed due to block header ${
                          blockHeaderRetryAttemptNumber - 1
                        } times. Rolling back block number by ${rollbackBlockOffset} for next retry`,
                      )
                      providerConfig.blockNumber = providerConfig.blockNumber
                        ? (await providerConfig.blockNumber) + rollbackBlockOffset
                        : (await chainProvider.getBlockNumber()) + rollbackBlockOffset

                      retryAll = true
                      blockHeaderRolledBack = true
                    }
                  }
                } else if (error instanceof ProviderTimeoutError) {
                  if (!haveRetriedForTimeout) {
                    haveRetriedForTimeout = true
                  }
                } else if (error instanceof ProviderGasError) {
                  if (!haveRetriedForOutOfGas) {
                    haveRetriedForOutOfGas = true
                  }
                  gasLimitOverride = gasErrorFailureOverride.gasLimitOverride
                  multicallChunk = gasErrorFailureOverride.multicallChunk
                  retryAll = true
                } else if (error instanceof SuccessRateError) {
                  if (!haveRetriedForSuccessRate) {
                    haveRetriedForSuccessRate = true

                    // Low success rate can indicate too little gas given to each call.
                    gasLimitOverride = successRateFailureOverrides.gasLimitOverride
                    multicallChunk = successRateFailureOverrides.multicallChunk
                    retryAll = true
                  }
                } else {
                  if (!haveRetriedForUnknownReason) {
                    haveRetriedForUnknownReason = true
                  }
                }
              }
            }

            if (retryAll) {
              console.log(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`)

              const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))

              const inputsChunked = chunk(inputs, normalizedChunk)
              quoteStates = map(inputsChunked, (inputChunk) => {
                return {
                  status: 'pending',
                  inputs: inputChunk,
                }
              })
            }

            const callResults = map(successfulQuoteStates, (quoteState) => quoteState.results)

            return {
              results: flatMap(callResults, (result) => result.results),
              blockNumber: JSBI.BigInt(callResults[0]!.blockNumber),
              approxGasUsedPerSuccessCall: stats.percentile(
                map(callResults, (result) => result.approxGasUsedPerSuccessCall),
                100,
              ),
            }
          },
          {
            ...retryOptions,
          },
        )

        // const routesQuotes = this.processQuoteResults(quoteResults, routes, amounts)

        // metric.putMetric('QuoteApproxGasUsedPerSuccessfulCall', approxGasUsedPerSuccessCall, MetricLoggerUnit.Count)

        // metric.putMetric('QuoteNumRetryLoops', finalAttemptNumber - 1, MetricLoggerUnit.Count)

        // metric.putMetric('QuoteTotalCallsToProvider', totalCallsMade, MetricLoggerUnit.Count)

        // metric.putMetric('QuoteExpectedCallsToProvider', expectedCallsMade, MetricLoggerUnit.Count)

        // metric.putMetric('QuoteNumRetriedCalls', totalCallsMade - expectedCallsMade, MetricLoggerUnit.Count)

        // const [successfulQuotes, failedQuotes] = _(routesQuotes)
        //   .flatMap((routeWithQuotes: RouteWithQuotes<TRoute>) => routeWithQuotes[1])
        //   .partition((quote) => quote.quote != null)
        //   .value()

        // log.info(
        //   `Got ${successfulQuotes.length} successful quotes, ${failedQuotes.length} failed quotes. Took ${
        //     finalAttemptNumber - 1
        //   } attempt loops. Total calls made to provider: ${totalCallsMade}. Have retried for timeout: ${haveRetriedForTimeout}`,
        // )

        // return { routesWithQuotes: routesQuotes, blockNumber }
        return []
      }
    }

    return {
      getRouteWithQuotesExactIn: createGetRoutesWithQuotes(true),
      getRouteWithQuotesExactOut: createGetRoutesWithQuotes(false),
    }
  }
}

function partitionQuotes(
  quoteStates: QuoteBatchState[],
): [QuoteBatchSuccess[], QuoteBatchFailed[], QuoteBatchPending[]] {
  const successfulQuoteStates: QuoteBatchSuccess[] = filter<QuoteBatchState, QuoteBatchSuccess>(
    quoteStates,
    (quoteState): quoteState is QuoteBatchSuccess => quoteState.status === 'success',
  )

  const failedQuoteStates: QuoteBatchFailed[] = filter<QuoteBatchState, QuoteBatchFailed>(
    quoteStates,
    (quoteState): quoteState is QuoteBatchFailed => quoteState.status === 'failed',
  )

  const pendingQuoteStates: QuoteBatchPending[] = filter<QuoteBatchState, QuoteBatchPending>(
    quoteStates,
    (quoteState): quoteState is QuoteBatchPending => quoteState.status === 'pending',
  )

  return [successfulQuoteStates, failedQuoteStates, pendingQuoteStates]
}

function validateSuccessRate(
  allResults: Result<[JSBI, JSBI[], number[], JSBI]>[],
  haveRetriedForSuccessRate: boolean,
  quoteMinSuccessRate: number,
): void | SuccessRateError {
  const numResults = allResults.length
  const numSuccessResults = allResults.filter((result) => result.success).length

  const successRate = (1.0 * numSuccessResults) / numResults

  if (successRate < quoteMinSuccessRate) {
    if (haveRetriedForSuccessRate) {
      console.log(
        `Quote success rate still below threshold despite retry. Continuing. ${quoteMinSuccessRate}: ${successRate}`,
      )
      return
    }

    return new SuccessRateError(`Quote success rate below threshold of ${quoteMinSuccessRate}: ${successRate}`)
  }
}

function validateBlockNumbers(
  successfulQuoteStates: QuoteBatchSuccess[],
  totalCalls: number,
  gasLimitOverride?: number,
): BlockConflictError | null {
  if (successfulQuoteStates.length <= 1) {
    return null
  }

  const results = map(successfulQuoteStates, (quoteState) => quoteState.results)

  const blockNumbers = map(results, (result) => result.blockNumber)

  const blockStrs = map(blockNumbers, (blockNumber) => blockNumber.toString())
  const uniqBlocks = uniq(blockStrs)

  if (uniqBlocks.length === 1) {
    return null
  }

  /* if (
      uniqBlocks.length == 2 &&
      Math.abs(uniqBlocks[0]! - uniqBlocks[1]!) <= 1
    ) {
      return null;
    } */

  return new BlockConflictError(
    `Quotes returned from different blocks. ${uniqBlocks}. ${totalCalls} calls were made with gas limit ${gasLimitOverride}`,
  )
}

export const createMixedRouteOnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: () => '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
  getQuoteFunctionName: () => 'quoteExactInput',
  contractInterface: new Interface(IMixedRouteQuoterV1ABI),
})

export const createV3OnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: () => '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
  getQuoteFunctionName: (isExactIn) => (isExactIn ? 'quoteExactInput' : 'quoteExactOutput'),
  contractInterface: new Interface(IQuoterV2ABI),
})
