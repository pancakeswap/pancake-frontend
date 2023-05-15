/* eslint-disable no-console, @typescript-eslint/no-shadow, @typescript-eslint/no-non-null-assertion, prefer-destructuring, camelcase, consistent-return, no-await-in-loop, no-lonely-if, @typescript-eslint/no-unused-vars */
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Abi, Address } from 'abitype'
import retry, { Options as RetryOptions } from 'async-retry'
import stats from 'stats-lite'
import flatMap from 'lodash/flatMap.js'
import uniq from 'lodash/uniq.js'
import chunk from 'lodash/chunk.js'

import { GasModel, OnChainProvider, QuoteProvider, QuoterOptions, RouteWithoutQuote, RouteWithQuote } from '../types'
import { mixedRouteQuoterV1ABI } from '../../abis/IMixedRouteQuoterV1'
import { quoterV2ABI } from '../../abis/IQuoterV2'
import { encodeMixedRouteToPath, getQuoteCurrency, isStablePool, isV2Pool, isV3Pool } from '../utils'
import { Result } from './multicallProvider'
import { PancakeMulticallProvider } from './multicallSwapProvider'
import { MIXED_ROUTE_QUOTER_ADDRESSES, V3_QUOTER_ADDRESSES } from '../../constants'
import { BatchMulticallConfigs, ChainMap } from '../../types'
import { BATCH_MULTICALL_CONFIGS } from '../../constants/multicall'

const DEFAULT_BATCH_RETRIES = 2

const SUCCESS_RATE_CONFIG = {
  [ChainId.BSC_TESTNET]: 0.1,
  [ChainId.BSC]: 0.1,
  [ChainId.ETHEREUM]: 0.1,
  [ChainId.GOERLI]: 0.1,
}

type V3Inputs = [string, string]
type MixedInputs = [string, number[], string]
type CallInputs = V3Inputs | MixedInputs

interface FactoryConfig {
  getCallInputs: (route: RouteWithoutQuote, isExactIn: boolean) => CallInputs
  getQuoterAddress: (chainId: ChainId) => Address
  abi: Abi | any[]
  getQuoteFunctionName: (isExactIn: boolean) => string
}

interface ProviderConfig {
  onChainProvider: OnChainProvider
  multicallConfigs?: ChainMap<BatchMulticallConfigs>
}

type QuoteBatchSuccess = {
  status: 'success'
  order: number
  inputs: [string, string][]
  results: {
    blockNumber: bigint
    results: Result<[bigint, bigint[], number[], bigint]>[]
    approxGasUsedPerSuccessCall: number
  }
}

type QuoteBatchFailed = {
  status: 'failed'
  order: number
  inputs: [string, string][]
  reason: Error
  results?: {
    blockNumber: bigint
    results: Result<[bigint, bigint[], number[], bigint]>[]
    approxGasUsedPerSuccessCall: number
  }
}

type QuoteBatchPending = {
  status: 'pending'
  order: number
  inputs: CallInputs[]
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

function onChainQuoteProviderFactory({ getQuoteFunctionName, getQuoterAddress, abi, getCallInputs }: FactoryConfig) {
  return function createOnChainQuoteProvider({
    onChainProvider,
    multicallConfigs: multicallConfigsOverride,
  }: ProviderConfig): QuoteProvider {
    const createGetRoutesWithQuotes = (isExactIn = true) => {
      const functionName = getQuoteFunctionName(isExactIn)
      const adjustQuoteForGas = (quote: CurrencyAmount<Currency>, gasCostInToken: CurrencyAmount<Currency>) =>
        isExactIn ? quote.subtract(gasCostInToken) : quote.add(gasCostInToken)

      return async function getRoutesWithQuote(
        routes: RouteWithoutQuote[],
        { blockNumber: blockNumberFromConfig, gasModel }: QuoterOptions,
      ): Promise<RouteWithQuote[]> {
        if (!routes.length) {
          return []
        }

        const chainId: ChainId = routes[0].amount.currency.chainId
        const multicallConfigs =
          multicallConfigsOverride?.[chainId] ||
          BATCH_MULTICALL_CONFIGS[chainId] ||
          BATCH_MULTICALL_CONFIGS[ChainId.ETHEREUM]
        const chainProvider = onChainProvider({ chainId })
        let { multicallChunk, gasLimitOverride } = multicallConfigs.defaultConfig
        const { gasErrorFailureOverride, successRateFailureOverrides } = multicallConfigs
        const retryOptions = {
          retries: DEFAULT_BATCH_RETRIES,
          minTimeout: 25,
          maxTimeout: 250,
        }
        const providerConfig = { blockNumber: blockNumberFromConfig }
        // const baseBlockOffset = 0
        const rollback = { enabled: false, rollbackBlockOffset: 0, attemptsBeforeRollback: 2 }
        const multicall2Provider = new PancakeMulticallProvider(chainId, chainProvider, gasLimitOverride)

        const inputs = routes.map<CallInputs>((route) => getCallInputs(route, isExactIn))

        const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))
        const inputsChunked = chunk(inputs, normalizedChunk)
        let quoteStates: QuoteBatchState[] = inputsChunked.map((inputChunk, index) => {
          return {
            order: index,
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

            // console.log(
            //   `Starting attempt: ${attemptNumber}.
            // rrently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
            // s limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`,
            // )

            quoteStates = await Promise.all(
              quoteStates.map(async (quoteState: QuoteBatchState, idx: number) => {
                if (quoteState.status === 'success') {
                  return quoteState
                }

                // QuoteChunk is pending or failed, so we try again
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const { inputs, order } = quoteState

                try {
                  totalCallsMade += 1

                  const results = await multicall2Provider.callSameFunctionOnContractWithMultipleParams<
                    CallInputs,
                    [bigint, bigint[], number[], bigint] // amountIn/amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate
                  >({
                    address: getQuoterAddress(chainId),
                    abi,
                    functionName,
                    functionParams: inputs,
                    providerConfig,
                    additionalConfig: {
                      gasLimitPerCallOverride: gasLimitOverride,
                    },
                  })

                  return {
                    order,
                    status: 'success',
                    inputs,
                    results,
                  } as QuoteBatchSuccess
                } catch (err: any) {
                  // Error from providers have huge messages that include all the calldata and fill the logs.
                  // Catch them and rethrow with shorter message.
                  if (err.message.includes('header not found')) {
                    return {
                      order,
                      status: 'failed',
                      inputs,
                      reason: new ProviderBlockHeaderError(err.message.slice(0, 500)),
                    } as QuoteBatchFailed
                  }

                  if (err.message.includes('timeout')) {
                    return {
                      order,
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
                      order,
                      status: 'failed',
                      inputs,
                      reason: new ProviderGasError(err.message.slice(0, 500)),
                    } as QuoteBatchFailed
                  }

                  return {
                    order,
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

            const reasonForFailureStr = failedQuoteStates
              .map((failedQuoteState) => failedQuoteState.reason.name)
              .join(', ')

            if (failedQuoteStates.length > 0) {
              // console.log(
              //   `On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`,
              // )

              for (const failedQuoteState of failedQuoteStates) {
                const { reason: error } = failedQuoteState

                // console.log({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`)

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
                      // console.log(
                      //   `Attempt ${attemptNumber}. Have failed due to block header ${blockHeaderRetryAttemptNumber - 1
                      //   } times. Rolling back block number by ${rollbackBlockOffset} for next retry`,
                      // )
                      providerConfig.blockNumber = providerConfig.blockNumber
                        ? // eslint-disable-next-line no-await-in-loop
                          BigInt(providerConfig.blockNumber) + BigInt(rollbackBlockOffset)
                        : // eslint-disable-next-line no-await-in-loop
                          (await chainProvider.getBlockNumber()) + BigInt(rollbackBlockOffset)

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
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (!haveRetriedForUnknownReason) {
                    haveRetriedForUnknownReason = true
                  }
                }
              }
            }

            let successRateError: Error | void
            if (failedQuoteStates.length === 0) {
              successRateError = validateSuccessRate(
                quoteStates.reduce<Result<[bigint, bigint[], number[], bigint]>[]>(
                  (acc, cur) => (cur.status === 'success' ? [...acc, ...(cur.results?.results || [])] : acc),
                  [],
                ),
                haveRetriedForSuccessRate,
                SUCCESS_RATE_CONFIG[chainId],
              )

              if (successRateError) {
                if (!haveRetriedForSuccessRate) {
                  haveRetriedForSuccessRate = true

                  // Low success rate can indicate too little gas given to each call.
                  gasLimitOverride = successRateFailureOverrides.gasLimitOverride
                  multicallChunk = successRateFailureOverrides.multicallChunk
                  retryAll = true
                }
              }
            }

            if (retryAll) {
              // console.log(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`)

              // eslint-disable-next-line @typescript-eslint/no-shadow
              const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))

              // eslint-disable-next-line @typescript-eslint/no-shadow
              const inputsChunked = chunk(inputs, normalizedChunk)
              quoteStates = inputsChunked.map((inputChunk, index) => {
                return {
                  order: index,
                  status: 'pending',
                  inputs: inputChunk,
                }
              })
            }

            if (failedQuoteStates.length > 0) {
              throw new Error(`Failed to get ${failedQuoteStates.length} quotes. Reasons: ${reasonForFailureStr}`)
            }

            if (successRateError) {
              throw successRateError
            }

            const orderedSuccessfulQuoteStates = successfulQuoteStates.sort((a, b) => (a.order < b.order ? -1 : 1))
            const callResults = orderedSuccessfulQuoteStates.map((quoteState) => quoteState.results)

            return {
              results: flatMap(callResults, (result) => result.results),
              blockNumber: BigInt(successfulQuoteStates[0]!.results.blockNumber),
              approxGasUsedPerSuccessCall: stats.percentile(
                callResults.map((result) => result.approxGasUsedPerSuccessCall),
                100,
              ),
            }
          },
          {
            ...retryOptions,
          },
        )

        const routesWithQuote = processQuoteResults(quoteResults, routes, gasModel, adjustQuoteForGas)

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
        return routesWithQuote
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
  const successfulQuoteStates: QuoteBatchSuccess[] = quoteStates.filter<QuoteBatchSuccess>(
    (quoteState): quoteState is QuoteBatchSuccess => quoteState.status === 'success',
  )

  const failedQuoteStates: QuoteBatchFailed[] = quoteStates.filter<QuoteBatchFailed>(
    (quoteState): quoteState is QuoteBatchFailed => quoteState.status === 'failed',
  )

  const pendingQuoteStates: QuoteBatchPending[] = quoteStates.filter<QuoteBatchPending>(
    (quoteState): quoteState is QuoteBatchPending => quoteState.status === 'pending',
  )

  return [successfulQuoteStates, failedQuoteStates, pendingQuoteStates]
}

function validateSuccessRate(
  allResults: Result<[bigint, bigint[], number[], bigint]>[],
  haveRetriedForSuccessRate: boolean,
  quoteMinSuccessRate: number,
): void | SuccessRateError {
  const numResults = allResults.length
  const numSuccessResults = allResults.filter((result) => result.success).length

  const successRate = (1.0 * numSuccessResults) / numResults

  if (successRate < quoteMinSuccessRate) {
    if (haveRetriedForSuccessRate) {
      // console.log(
      //   `Quote success rate still below threshold despite retry. Continuing. ${quoteMinSuccessRate}: ${successRate}`,
      // )
      return
    }

    // eslint-disable-next-line consistent-return
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

  const results = successfulQuoteStates.map((quoteState) => quoteState.results)

  const blockNumbers = results.map((result) => result.blockNumber)

  const blockStrs = blockNumbers.map((blockNumber) => blockNumber.toString())
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

function processQuoteResults(
  quoteResults: (Result<[bigint, bigint[], number[], bigint]> | null)[],
  routes: RouteWithoutQuote[],
  gasModel: GasModel,
  adjustQuoteForGas: (
    quote: CurrencyAmount<Currency>,
    gasCostInToken: CurrencyAmount<Currency>,
  ) => CurrencyAmount<Currency>,
): RouteWithQuote[] {
  const routesWithQuote: RouteWithQuote[] = []

  // const debugFailedQuotes: {
  //   amount: string
  //   percent: number
  //   route: string
  // }[] = []

  for (let i = 0; i < quoteResults.length; i += 1) {
    const route = routes[i]
    const quoteResult = quoteResults[i]
    if (!quoteResult) {
      continue
    }

    const { success } = quoteResult

    if (!success) {
      // const amountStr = amount.toFixed(Math.min(amount.currency.decimals, 2))
      // const routeStr = routeToString(route)
      // debugFailedQuotes.push({
      //   route: routeStr,
      //   percent,
      //   amount: amountStr,
      // })
      continue
    }

    const quoteCurrency = getQuoteCurrency(route, route.amount.currency)
    const quote = CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, quoteResult.result[0].toString())
    const { gasEstimate, gasCostInToken, gasCostInUSD } = gasModel.estimateGasCost(
      {
        ...route,
        quote,
      },
      { initializedTickCrossedList: quoteResult.result[2] },
    )

    routesWithQuote.push({
      ...route,
      quote,
      quoteAdjustedForGas: adjustQuoteForGas(quote, gasCostInToken),
      // sqrtPriceX96AfterList: quoteResult.result[1],
      gasEstimate,
      gasCostInToken,
      gasCostInUSD,
    })
  }

  // // For routes and amounts that we failed to get a quote for, group them by route
  // // and batch them together before logging to minimize number of logs.
  // const debugChunk = 80
  // _.forEach(_.chunk(debugFailedQuotes, debugChunk), (quotes, idx) => {
  //   const failedQuotesByRoute = _.groupBy(quotes, (q) => q.route)
  //   const failedFlat = _.mapValues(failedQuotesByRoute, (f) =>
  //     _(f)
  //       .map((f) => `${f.percent}%[${f.amount}]`)
  //       .join(','),
  //   )

  //   log.info(
  //     {
  //       failedQuotes: _.map(failedFlat, (amounts, routeStr) => `${routeStr} : ${amounts}`),
  //     },
  //     `Failed on chain quotes for routes Part ${idx}/${Math.ceil(debugFailedQuotes.length / debugChunk)}`,
  //   )
  // })

  return routesWithQuote
}

export const createMixedRouteOnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: (chainId) => MIXED_ROUTE_QUOTER_ADDRESSES[chainId],
  getQuoteFunctionName: () => 'quoteExactInput',
  abi: mixedRouteQuoterV1ABI,
  getCallInputs: (route, isExactIn) => [
    encodeMixedRouteToPath(route, !isExactIn),
    route.pools
      .map((pool) => {
        if (isV3Pool(pool)) {
          return 0
        }
        if (isV2Pool(pool)) {
          return 1
        }
        if (isStablePool(pool)) {
          if (pool.balances.length === 2) {
            return 2
          }
          if (pool.balances.length === 3) {
            return 3
          }
        }
        return -1
      })
      .filter((index) => index >= 0),
    `0x${route.amount.quotient.toString(16)}`,
  ],
})

export const createV3OnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: (chainId) => V3_QUOTER_ADDRESSES[chainId],
  getQuoteFunctionName: (isExactIn) => (isExactIn ? 'quoteExactInput' : 'quoteExactOutput'),
  abi: quoterV2ABI,
  getCallInputs: (route, isExactIn) => [
    encodeMixedRouteToPath(route, !isExactIn),
    `0x${route.amount.quotient.toString(16)}`,
  ],
})
