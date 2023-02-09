/* eslint-disable no-console */
import { BaseRoute, OnChainProvider, QuoteProvider, RouteWithoutQuote, RouteWithQuote } from '../types'
import { encodeMixedRouteToPath } from '../utils'

interface FactoryConfig {
  abi: any[]
  functionName: string
}

interface ProviderConfig {
  onChainProvider: OnChainProvider
}

function onChainQuoteProviderFactory({ abi, functionName }: FactoryConfig) {
  console.log(abi, functionName)
  return function createOnChainQuoteProvider({ onChainProvider }: ProviderConfig): QuoteProvider {
    console.log(onChainProvider)

    const createGetRoutesWithQuotes = (isExactIn = true) => {
      const encodeRouteToPath = (route: BaseRoute) => encodeMixedRouteToPath(route, !isExactIn)

      return async function getRoutesWithQuote(routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> {
        // let multicallChunk = 150
        // let gasLimitOverride = 1_000_000
        // const baseBlockOffset = 0
        // const rollback = { enable: false }

        const inputs = routes.map((route) => [
          encodeRouteToPath({
            pools: route.pools,
            path: route.path,
            type: route.type,
            input: route.amount.currency,
          }),
          `0x${route.amount.quotient.toString(16)}`,
        ])
        console.log('---------inputs', inputs)

        // const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))
        // const inputsChunked = _.chunk(inputs, normalizedChunk)
        // let quoteStates: QuoteBatchState[] = _.map(inputsChunked, (inputChunk) => {
        //   return {
        //     status: 'pending',
        //     inputs: inputChunk,
        //   }
        // })

        // log.info(
        //   `About to get ${inputs.length} quotes in chunks of ${normalizedChunk} [${_.map(
        //     inputsChunked,
        //     (i) => i.length,
        //   ).join(',')}] ${
        //     gasLimitOverride ? `with a gas limit override of ${gasLimitOverride}` : ''
        //   } and block number: ${await providerConfig.blockNumber} [Original before offset: ${originalBlockNumber}].`,
        // )

        // let haveRetriedForSuccessRate = false
        // let haveRetriedForBlockHeader = false
        // let blockHeaderRetryAttemptNumber = 0
        // let haveIncrementedBlockHeaderFailureCounter = false
        // let blockHeaderRolledBack = false
        // let haveRetriedForBlockConflictError = false
        // let haveRetriedForOutOfGas = false
        // let haveRetriedForTimeout = false
        // let haveRetriedForUnknownReason = false
        // let finalAttemptNumber = 1
        // const expectedCallsMade = quoteStates.length
        // let totalCallsMade = 0

        // const {
        //   results: quoteResults,
        //   blockNumber,
        //   approxGasUsedPerSuccessCall,
        // } = await retry(
        //   async (_bail, attemptNumber) => {
        //     haveIncrementedBlockHeaderFailureCounter = false
        //     finalAttemptNumber = attemptNumber

        //     const [success, failed, pending] = this.partitionQuotes(quoteStates)

        //     log.info(
        //       `Starting attempt: ${attemptNumber}.
        //   Currently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
        //   Gas limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`,
        //     )

        //     quoteStates = await Promise.all(
        //       _.map(quoteStates, async (quoteState: QuoteBatchState, idx: number) => {
        //         if (quoteState.status == 'success') {
        //           return quoteState
        //         }

        //         // QuoteChunk is pending or failed, so we try again
        //         const { inputs } = quoteState

        //         try {
        //           totalCallsMade = totalCallsMade + 1

        //           const results = await this.multicall2Provider.callSameFunctionOnContractWithMultipleParams<
        //             [string, string],
        //             [BigNumber, BigNumber[], number[], BigNumber] // amountIn/amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate
        //           >({
        //             address: this.getQuoterAddress(useMixedRouteQuoter),
        //             contractInterface: useMixedRouteQuoter
        //               ? IMixedRouteQuoterV1__factory.createInterface()
        //               : IQuoterV2__factory.createInterface(),
        //             functionName,
        //             functionParams: inputs,
        //             providerConfig,
        //             additionalConfig: {
        //               gasLimitPerCallOverride: gasLimitOverride,
        //             },
        //           })

        //           const successRateError = this.validateSuccessRate(results.results, haveRetriedForSuccessRate)

        //           if (successRateError) {
        //             return {
        //               status: 'failed',
        //               inputs,
        //               reason: successRateError,
        //               results,
        //             } as QuoteBatchFailed
        //           }

        //           return {
        //             status: 'success',
        //             inputs,
        //             results,
        //           } as QuoteBatchSuccess
        //         } catch (err: any) {
        //           // Error from providers have huge messages that include all the calldata and fill the logs.
        //           // Catch them and rethrow with shorter message.
        //           if (err.message.includes('header not found')) {
        //             return {
        //               status: 'failed',
        //               inputs,
        //               reason: new ProviderBlockHeaderError(err.message.slice(0, 500)),
        //             } as QuoteBatchFailed
        //           }

        //           if (err.message.includes('timeout')) {
        //             return {
        //               status: 'failed',
        //               inputs,
        //               reason: new ProviderTimeoutError(
        //                 `Req ${idx}/${quoteStates.length}. Request had ${inputs.length} inputs. ${err.message.slice(
        //                   0,
        //                   500,
        //                 )}`,
        //               ),
        //             } as QuoteBatchFailed
        //           }

        //           if (err.message.includes('out of gas')) {
        //             return {
        //               status: 'failed',
        //               inputs,
        //               reason: new ProviderGasError(err.message.slice(0, 500)),
        //             } as QuoteBatchFailed
        //           }

        //           return {
        //             status: 'failed',
        //             inputs,
        //             reason: new Error(`Unknown error from provider: ${err.message.slice(0, 500)}`),
        //           } as QuoteBatchFailed
        //         }
        //       }),
        //     )

        //     const [successfulQuoteStates, failedQuoteStates, pendingQuoteStates] = this.partitionQuotes(quoteStates)

        //     if (pendingQuoteStates.length > 0) {
        //       throw new Error('Pending quote after waiting for all promises.')
        //     }

        //     let retryAll = false

        //     const blockNumberError = this.validateBlockNumbers(
        //       successfulQuoteStates,
        //       inputsChunked.length,
        //       gasLimitOverride,
        //     )

        //     // If there is a block number conflict we retry all the quotes.
        //     if (blockNumberError) {
        //       retryAll = true
        //     }

        //     const reasonForFailureStr = _.map(
        //       failedQuoteStates,
        //       (failedQuoteState) => failedQuoteState.reason.name,
        //     ).join(', ')

        //     if (failedQuoteStates.length > 0) {
        //       log.info(
        //         `On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`,
        //       )

        //       for (const failedQuoteState of failedQuoteStates) {
        //         const { reason: error } = failedQuoteState

        //         log.info({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`)

        //         if (error instanceof BlockConflictError) {
        //           if (!haveRetriedForBlockConflictError) {
        //             metric.putMetric('QuoteBlockConflictErrorRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForBlockConflictError = true
        //           }

        //           retryAll = true
        //         } else if (error instanceof ProviderBlockHeaderError) {
        //           if (!haveRetriedForBlockHeader) {
        //             metric.putMetric('QuoteBlockHeaderNotFoundRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForBlockHeader = true
        //           }

        //           // Ensure that if multiple calls fail due to block header in the current pending batch,
        //           // we only count once.
        //           if (!haveIncrementedBlockHeaderFailureCounter) {
        //             blockHeaderRetryAttemptNumber = blockHeaderRetryAttemptNumber + 1
        //             haveIncrementedBlockHeaderFailureCounter = true
        //           }

        //           if (rollback.enabled) {
        //             const { rollbackBlockOffset, attemptsBeforeRollback } = rollback

        //             if (blockHeaderRetryAttemptNumber >= attemptsBeforeRollback && !blockHeaderRolledBack) {
        //               log.info(
        //                 `Attempt ${attemptNumber}. Have failed due to block header ${
        //                   blockHeaderRetryAttemptNumber - 1
        //                 } times. Rolling back block number by ${rollbackBlockOffset} for next retry`,
        //               )
        //               providerConfig.blockNumber = providerConfig.blockNumber
        //                 ? (await providerConfig.blockNumber) + rollbackBlockOffset
        //                 : (await this.provider.getBlockNumber()) + rollbackBlockOffset

        //               retryAll = true
        //               blockHeaderRolledBack = true
        //             }
        //           }
        //         } else if (error instanceof ProviderTimeoutError) {
        //           if (!haveRetriedForTimeout) {
        //             metric.putMetric('QuoteTimeoutRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForTimeout = true
        //           }
        //         } else if (error instanceof ProviderGasError) {
        //           if (!haveRetriedForOutOfGas) {
        //             metric.putMetric('QuoteOutOfGasExceptionRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForOutOfGas = true
        //           }
        //           gasLimitOverride = this.gasErrorFailureOverride.gasLimitOverride
        //           multicallChunk = this.gasErrorFailureOverride.multicallChunk
        //           retryAll = true
        //         } else if (error instanceof SuccessRateError) {
        //           if (!haveRetriedForSuccessRate) {
        //             metric.putMetric('QuoteSuccessRateRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForSuccessRate = true

        //             // Low success rate can indicate too little gas given to each call.
        //             gasLimitOverride = this.successRateFailureOverrides.gasLimitOverride
        //             multicallChunk = this.successRateFailureOverrides.multicallChunk
        //             retryAll = true
        //           }
        //         } else {
        //           if (!haveRetriedForUnknownReason) {
        //             metric.putMetric('QuoteUnknownReasonRetry', 1, MetricLoggerUnit.Count)
        //             haveRetriedForUnknownReason = true
        //           }
        //         }
        //       }
        //     }

        //     if (retryAll) {
        //       log.info(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`)

        //       const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk))

        //       const inputsChunked = _.chunk(inputs, normalizedChunk)
        //       quoteStates = _.map(inputsChunked, (inputChunk) => {
        //         return {
        //           status: 'pending',
        //           inputs: inputChunk,
        //         }
        //       })
        //     }

        //     if (failedQuoteStates.length > 0) {
        //       // TODO: Work with Arbitrum to find a solution for making large multicalls with gas limits that always
        //       // successfully.
        //       //
        //       // On Arbitrum we can not set a gas limit for every call in the multicall and guarantee that
        //       // we will not run out of gas on the node. This is because they have a different way of accounting
        //       // for gas, that seperates storage and compute gas costs, and we can not cover both in a single limit.
        //       //
        //       // To work around this and avoid throwing errors when really we just couldn't get a quote, we catch this
        //       // case and return 0 quotes found.
        //       if (
        //         (this.chainId == ChainId.ARBITRUM_ONE ||
        //           this.chainId == ChainId.ARBITRUM_RINKEBY ||
        //           this.chainId == ChainId.ARBITRUM_GOERLI) &&
        //         _.every(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason instanceof ProviderGasError) &&
        //         attemptNumber == this.retryOptions.retries
        //       ) {
        //         log.error(
        //           `Failed to get quotes on Arbitrum due to provider gas error issue. Overriding error to return 0 quotes.`,
        //         )
        //         return {
        //           results: [],
        //           blockNumber: BigNumber.from(0),
        //           approxGasUsedPerSuccessCall: 0,
        //         }
        //       }
        //       throw new Error(`Failed to get ${failedQuoteStates.length} quotes. Reasons: ${reasonForFailureStr}`)
        //     }

        //     const callResults = _.map(successfulQuoteStates, (quoteState) => quoteState.results)

        //     return {
        //       results: _.flatMap(callResults, (result) => result.results),
        //       blockNumber: BigNumber.from(callResults[0]!.blockNumber),
        //       approxGasUsedPerSuccessCall: stats.percentile(
        //         _.map(callResults, (result) => result.approxGasUsedPerSuccessCall),
        //         100,
        //       ),
        //     }
        //   },
        //   {
        //     retries: DEFAULT_BATCH_RETRIES,
        //     ...this.retryOptions,
        //   },
        // )

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

export const createMixedRouteOnChainQuoteProvider = onChainQuoteProviderFactory({
  abi: [],
  functionName: '',
})

export const createV3OnChainQuoteProvider = onChainQuoteProviderFactory({
  abi: [],
  functionName: '',
})
