/* eslint-disable no-console, @typescript-eslint/no-non-null-assertion */
import { ChainId, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import FixedReverseHeap from 'mnemonist/fixed-reverse-heap.js'
import Queue from 'mnemonist/queue.js'
import flatMap from 'lodash/flatMap.js'
import mapValues from 'lodash/mapValues.js'

import { BestRoutes, L1ToL2GasCosts, RouteWithQuote } from '../types'
import { getPoolAddress, isV2Pool, isV3Pool } from '../utils'
import { usdGasTokensByChain } from '../../constants'

interface Config {
  minSplits?: number
  maxSplits?: number
}

export function getBestRouteCombinationByQuotes(
  amount: CurrencyAmount<Currency>,
  quoteCurrency: Currency,
  routesWithQuote: RouteWithQuote[],
  tradeType: TradeType,
  config: Config,
): BestRoutes | null {
  // eslint-disable-next-line
  const chainId: ChainId = amount.currency.chainId
  // const now = Date.now()

  // Build a map of percentage of the input to list of valid quotes.
  // Quotes can be null for a variety of reasons (not enough liquidity etc), so we drop them here too.
  const percents: number[] = []
  const percentToQuotes: { [percent: number]: RouteWithQuote[] } = {}
  for (const routeWithQuote of routesWithQuote) {
    if (!percentToQuotes[routeWithQuote.percent]) {
      percentToQuotes[routeWithQuote.percent] = []
      percents.push(routeWithQuote.percent)
    }
    percentToQuotes[routeWithQuote.percent]!.push(routeWithQuote)
  }

  // metric.putMetric(
  //   'BuildRouteWithValidQuoteObjects',
  //   Date.now() - now,
  //   MetricLoggerUnit.Milliseconds
  // );

  // Given all the valid quotes for each percentage find the optimal route.
  const swapRoute = getBestSwapRouteBy(
    tradeType,
    percentToQuotes,
    percents.sort((a, b) => a - b),
    chainId,
    (rq: RouteWithQuote) => rq.quoteAdjustedForGas,
    config,
  )

  // It is possible we were unable to find any valid route given the quotes.
  if (!swapRoute) {
    return null
  }

  // Due to potential loss of precision when taking percentages of the input it is possible that the sum of the amounts of each
  // route of our optimal quote may not add up exactly to exactIn or exactOut.
  //
  // We check this here, and if there is a mismatch
  // add the missing amount to a random route. The missing amount size should be neglible so the quote should still be highly accurate.
  const { routes: routeAmounts } = swapRoute
  const totalAmount = routeAmounts.reduce(
    (total, routeAmount) => total.add(routeAmount.amount),
    CurrencyAmount.fromRawAmount(routeAmounts[0]!.amount.currency, 0),
  )

  const missingAmount = amount.subtract(totalAmount)
  if (missingAmount.greaterThan(0)) {
    console.log(
      {
        missingAmount: missingAmount.quotient.toString(),
      },
      `Optimal route's amounts did not equal exactIn/exactOut total. Adding missing amount to last route in array.`,
    )

    routeAmounts[routeAmounts.length - 1]!.amount = routeAmounts[routeAmounts.length - 1]!.amount.add(missingAmount)
  }

  console.log(
    {
      routes: routeAmounts,
      numSplits: routeAmounts.length,
      amount: amount.toExact(),
      quote: swapRoute.quote.toExact(),
      quoteGasAdjusted: swapRoute.quoteGasAdjusted.toFixed(Math.min(swapRoute.quoteGasAdjusted.currency.decimals, 2)),
      estimatedGasUSD: swapRoute.estimatedGasUsedUSD.toFixed(
        Math.min(swapRoute.estimatedGasUsedUSD.currency.decimals, 2),
      ),
      estimatedGasToken: swapRoute.estimatedGasUsedQuoteToken.toFixed(
        Math.min(swapRoute.estimatedGasUsedQuoteToken.currency.decimals, 2),
      ),
    },
    `Found best swap route. ${routeAmounts.length} split.`,
  )

  const { routes, quote: quoteAmount, estimatedGasUsed, estimatedGasUsedUSD } = swapRoute
  const quote = CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmount.quotient)
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  return {
    routes: routes.map(({ type, amount: routeAmount, quote: routeQuoteAmount, pools, path, percent }) => {
      const routeQuote = CurrencyAmount.fromRawAmount(quoteCurrency, routeQuoteAmount.quotient)
      return {
        percent,
        type,
        pools,
        path,
        inputAmount: isExactIn ? routeAmount : routeQuote,
        outputAmount: isExactIn ? routeQuote : routeAmount,
      }
    }),
    gasEstimate: estimatedGasUsed,
    gasEstimateInUSD: estimatedGasUsedUSD,
    inputAmount: isExactIn ? amount : quote,
    outputAmount: isExactIn ? quote : amount,
  }
}

export function getBestSwapRouteBy(
  tradeType: TradeType,
  percentToQuotes: { [percent: number]: RouteWithQuote[] },
  percents: number[],
  chainId: ChainId,
  by: (routeQuote: RouteWithQuote) => CurrencyAmount<Currency>,
  { maxSplits = 4, minSplits = 0 }: Config,
): {
  quote: CurrencyAmount<Currency>
  quoteGasAdjusted: CurrencyAmount<Currency>
  estimatedGasUsed: bigint
  estimatedGasUsedUSD: CurrencyAmount<Currency>
  estimatedGasUsedQuoteToken: CurrencyAmount<Currency>
  routes: RouteWithQuote[]
} | null {
  // Build a map of percentage to sorted list of quotes, with the biggest quote being first in the list.
  const percentToSortedQuotes = mapValues(percentToQuotes, (routeQuotes: RouteWithQuote[]) => {
    return routeQuotes.sort((routeQuoteA, routeQuoteB) => {
      if (tradeType === TradeType.EXACT_INPUT) {
        return by(routeQuoteA).greaterThan(by(routeQuoteB)) ? -1 : 1
      }
      return by(routeQuoteA).lessThan(by(routeQuoteB)) ? -1 : 1
    })
  })

  const quoteCompFn =
    tradeType === TradeType.EXACT_INPUT
      ? (a: CurrencyAmount<Currency>, b: CurrencyAmount<Currency>) => a.greaterThan(b)
      : (a: CurrencyAmount<Currency>, b: CurrencyAmount<Currency>) => a.lessThan(b)

  const sumFn = (currencyAmounts: CurrencyAmount<Currency>[]): CurrencyAmount<Currency> => {
    let sum = currencyAmounts[0]!
    for (let i = 1; i < currencyAmounts.length; i++) {
      sum = sum.add(currencyAmounts[i]!)
    }
    return sum
  }

  let bestQuote: CurrencyAmount<Currency> | undefined
  let bestSwap: RouteWithQuote[] | undefined

  // Min-heap for tracking the 5 best swaps given some number of splits.
  const bestSwapsPerSplit = new FixedReverseHeap<{
    quote: CurrencyAmount<Currency>
    routes: RouteWithQuote[]
  }>(
    Array,
    (a, b) => {
      return quoteCompFn(a.quote, b.quote) ? -1 : 1
    },
    3,
  )

  if (!percentToSortedQuotes[100] || minSplits > 1) {
    console.log(
      {
        percentToSortedQuotes: mapValues(percentToSortedQuotes, (p) => p.length),
      },
      'Did not find a valid route without any splits. Continuing search anyway.',
    )
  } else {
    bestQuote = by(percentToSortedQuotes[100][0]!)
    bestSwap = [percentToSortedQuotes[100][0]!]

    for (const routeWithQuote of percentToSortedQuotes[100].slice(0, 5)) {
      bestSwapsPerSplit.push({
        quote: by(routeWithQuote),
        routes: [routeWithQuote],
      })
    }
  }

  // We do a BFS. Each additional node in a path represents us adding an additional split to the route.
  const queue = new Queue<{
    percentIndex: number
    curRoutes: RouteWithQuote[]
    remainingPercent: number
    special: boolean
  }>()

  // First we seed BFS queue with the best quotes for each percentage.
  // i.e. [best quote when sending 10% of amount, best quote when sending 20% of amount, ...]
  // We will explore the various combinations from each node.
  for (let i = percents.length; i >= 0; i--) {
    const percent = percents[i]!

    if (!percentToSortedQuotes[percent]) {
      continue
    }

    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent]![0]!],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: false,
    })

    if (!percentToSortedQuotes[percent] || !percentToSortedQuotes[percent]![1]) {
      continue
    }

    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent]![1]!],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: true,
    })
  }

  let splits = 1
  // let startedSplit = Date.now()

  while (queue.size > 0) {
    // metric.putMetric(
    //   `Split${splits}Done`,
    //   Date.now() - startedSplit,
    //   MetricLoggerUnit.Milliseconds
    // );

    // startedSplit = Date.now()

    console.log(
      {
        top5: Array.from(bestSwapsPerSplit.consume()).map(
          (q) =>
            `${q.quote.toExact()} (${q.routes
              .map(
                (r) =>
                  `${r.percent}% ${r.amount.toExact()} ${r.pools
                    .map((p) => {
                      if (isV2Pool(p)) {
                        return `V2 ${p.reserve0.currency.symbol}-${p.reserve1.currency.symbol}`
                      }
                      if (isV3Pool(p)) {
                        return `V3 fee ${p.fee} ${p.token0.symbol}-${p.token1.symbol}`
                      }
                      return `Stable ${p.balances.map((b) => b.currency).join('-')}`
                    })
                    .join(', ')} ${r.quote.toExact()}`,
              )
              .join(', ')})`,
        ),
        onQueue: queue.size,
      },
      `Top 3 with ${splits} splits`,
    )

    bestSwapsPerSplit.clear()

    // Size of the queue at this point is the number of potential routes we are investigating for the given number of splits.
    let layer = queue.size
    splits++

    // If we didn't improve our quote by adding another split, very unlikely to improve it by splitting more after that.
    if (splits >= 3 && bestSwap && bestSwap.length < splits - 1) {
      break
    }

    if (splits > maxSplits) {
      console.log('Max splits reached. Stopping search.')
      // metric.putMetric(`MaxSplitsHitReached`, 1, MetricLoggerUnit.Count);
      break
    }

    while (layer > 0) {
      layer--

      const { remainingPercent, curRoutes, percentIndex, special } = queue.dequeue()!

      // For all other percentages, add a new potential route.
      // E.g. if our current aggregated route if missing 50%, we will create new nodes and add to the queue for:
      // 50% + new 10% route, 50% + new 20% route, etc.
      for (let i = percentIndex; i >= 0; i--) {
        const percentA = percents[i]!

        if (percentA > remainingPercent) {
          continue
        }

        // At some point the amount * percentage is so small that the quoter is unable to get
        // a quote. In this case there could be no quotes for that percentage.
        if (!percentToSortedQuotes[percentA]) {
          continue
        }

        const candidateRoutesA = percentToSortedQuotes[percentA]!

        // Find the best route in the complimentary percentage that doesn't re-use a pool already
        // used in the current route. Re-using pools is not allowed as each swap through a pool changes its liquidity,
        // so it would make the quotes inaccurate.
        const routeWithQuoteA = findFirstRouteNotUsingUsedPools(curRoutes, candidateRoutesA)

        if (!routeWithQuoteA) {
          continue
        }

        const remainingPercentNew = remainingPercent - percentA
        const curRoutesNew = [...curRoutes, routeWithQuoteA]

        // If we've found a route combination that uses all 100%, and it has at least minSplits, update our best route.
        if (remainingPercentNew === 0 && splits >= minSplits) {
          const quotesNew = curRoutesNew.map((r) => by(r))
          const quoteNew = sumFn(quotesNew)

          const gasCostL1QuoteToken = CurrencyAmount.fromRawAmount(quoteNew.currency, 0)

          // if (HAS_L1_FEE.includes(chainId)) {
          //   const onlyV3Routes = curRoutesNew.every((route) => route.protocol == Protocol.V3)

          //   if (gasModel == undefined || !onlyV3Routes) {
          //     throw new Error("Can't compute L1 gas fees.")
          //   } else {
          //     const gasCostL1 = await gasModel.calculateL1GasFees!(curRoutesNew as V3RouteWithValidQuote[])
          //     gasCostL1QuoteToken = gasCostL1.gasCostL1QuoteToken
          //   }
          // }

          const quoteAfterL1Adjust =
            tradeType === TradeType.EXACT_INPUT
              ? quoteNew.subtract(gasCostL1QuoteToken)
              : quoteNew.add(gasCostL1QuoteToken)

          bestSwapsPerSplit.push({
            quote: quoteAfterL1Adjust,
            routes: curRoutesNew,
          })

          if (!bestQuote || quoteCompFn(quoteAfterL1Adjust, bestQuote)) {
            bestQuote = quoteAfterL1Adjust
            bestSwap = curRoutesNew

            // Temporary experiment.
            // if (special) {
            //   metric.putMetric(
            //     `BestSwapNotPickingBestForPercent`,
            //     1,
            //     MetricLoggerUnit.Count
            //   );
            // }
          }
        } else {
          queue.enqueue({
            curRoutes: curRoutesNew,
            remainingPercent: remainingPercentNew,
            percentIndex: i,
            special,
          })
        }
      }
    }
  }

  if (!bestSwap) {
    console.log(`Could not find a valid swap`)
    return null
  }

  // const postSplitNow = Date.now()

  let quoteGasAdjusted = sumFn(bestSwap.map((routeWithValidQuote) => routeWithValidQuote.quoteAdjustedForGas))

  // this calculates the base gas used
  // if on L1, its the estimated gas used based on hops and ticks across all the routes
  // if on L2, its the gas used on the L2 based on hops and ticks across all the routes
  const estimatedGasUsed = bestSwap
    .map((routeWithValidQuote) => routeWithValidQuote.gasEstimate)
    .reduce((sum, routeWithValidQuote) => sum + routeWithValidQuote, 0n)

  if (!usdGasTokensByChain[chainId] || !usdGasTokensByChain[chainId]![0]) {
    // Each route can use a different stablecoin to account its gas costs.
    // They should all be pegged, and this is just an estimate, so we do a merge
    // to an arbitrary stable.
    throw new Error(`Could not find a USD token for computing gas costs on ${chainId}`)
  }
  const usdToken = usdGasTokensByChain[chainId]![0]!
  const usdTokenDecimals = usdToken.decimals

  // if on L2, calculate the L1 security fee
  const gasCostsL1ToL2: L1ToL2GasCosts = {
    gasUsedL1: 0n,
    gasCostL1USD: CurrencyAmount.fromRawAmount(usdToken, 0),
    gasCostL1QuoteToken: CurrencyAmount.fromRawAmount(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      bestSwap[0]?.quote.currency.wrapped,
      0,
    ),
  }
  // // If swapping on an L2 that includes a L1 security fee, calculate the fee and include it in the gas adjusted quotes
  // if (HAS_L1_FEE.includes(chainId)) {
  //   // ensure the gasModel exists and that the swap route is a v3 only route
  //   const onlyV3Routes = bestSwap.every((route) => route.protocol == Protocol.V3)
  //   if (gasModel == undefined || !onlyV3Routes) {
  //     throw new Error("Can't compute L1 gas fees.")
  //   } else {
  //     gasCostsL1ToL2 = await gasModel.calculateL1GasFees!(bestSwap as V3RouteWithValidQuote[])
  //   }
  // }

  const { gasCostL1USD, gasCostL1QuoteToken } = gasCostsL1ToL2

  // For each gas estimate, normalize decimals to that of the chosen usd token.
  const estimatedGasUsedUSDs = bestSwap.map((routeWithValidQuote) => {
    // TODO: will error if gasToken has decimals greater than usdToken
    const decimalsDiff = usdTokenDecimals - routeWithValidQuote.gasCostInUSD.currency.decimals

    if (decimalsDiff === 0) {
      return CurrencyAmount.fromRawAmount(usdToken, routeWithValidQuote.gasCostInUSD.quotient)
    }

    return CurrencyAmount.fromRawAmount(
      usdToken,
      routeWithValidQuote.gasCostInUSD.quotient * 10n ** BigInt(decimalsDiff),
    )
  })

  let estimatedGasUsedUSD = sumFn(estimatedGasUsedUSDs)

  // if they are different usd pools, convert to the usdToken
  if (!estimatedGasUsedUSD.currency.equals(gasCostL1USD.currency)) {
    const decimalsDiff = usdTokenDecimals - gasCostL1USD.currency.decimals
    estimatedGasUsedUSD = estimatedGasUsedUSD.add(
      CurrencyAmount.fromRawAmount(usdToken, gasCostL1USD.quotient * 10n ** BigInt(decimalsDiff)),
    )
  } else {
    estimatedGasUsedUSD = estimatedGasUsedUSD.add(gasCostL1USD)
  }

  // console.log(
  //   {
  //     estimatedGasUsedUSD: estimatedGasUsedUSD.toExact(),
  //     normalizedUsdToken: usdToken,
  //     routeUSDGasEstimates: _.map(
  //       bestSwap,
  //       (b) => `${b.percent}% ${routeToString(b.route)} ${b.gasCostInUSD.toExact()}`,
  //     ),
  //     flatL1GasCostUSD: gasCostL1USD.toExact(),
  //   },
  //   'USD gas estimates of best route',
  // )

  const estimatedGasUsedQuoteToken = sumFn(
    bestSwap.map((routeWithValidQuote) => routeWithValidQuote.gasCostInToken),
  ).add(gasCostL1QuoteToken)

  const quote = sumFn(bestSwap.map((routeWithValidQuote) => routeWithValidQuote.quote))

  // Adjust the quoteGasAdjusted for the l1 fee
  if (tradeType === TradeType.EXACT_INPUT) {
    const quoteGasAdjustedForL1 = quoteGasAdjusted.subtract(gasCostL1QuoteToken)
    quoteGasAdjusted = quoteGasAdjustedForL1
  } else {
    const quoteGasAdjustedForL1 = quoteGasAdjusted.add(gasCostL1QuoteToken)
    quoteGasAdjusted = quoteGasAdjustedForL1
  }

  const routeWithQuotes = bestSwap.sort((routeAmountA, routeAmountB) =>
    routeAmountB.amount.greaterThan(routeAmountA.amount) ? 1 : -1,
  )

  // metric.putMetric(
  //   'PostSplitDone',
  //   Date.now() - postSplitNow,
  //   MetricLoggerUnit.Milliseconds
  // );
  return {
    quote,
    quoteGasAdjusted,
    estimatedGasUsed,
    estimatedGasUsedUSD,
    estimatedGasUsedQuoteToken,
    routes: routeWithQuotes,
  }
}

// We do not allow pools to be re-used across split routes, as swapping through a pool changes the pools state.
// Given a list of used routes, this function finds the first route in the list of candidate routes that does not re-use an already used pool.
const findFirstRouteNotUsingUsedPools = (
  usedRoutes: RouteWithQuote[],
  candidateRouteQuotes: RouteWithQuote[],
): RouteWithQuote | null => {
  const poolAddressSet = new Set()
  const usedPoolAddresses = flatMap(usedRoutes, ({ pools }) => pools.map(getPoolAddress))

  for (const poolAddress of usedPoolAddresses) {
    poolAddressSet.add(poolAddress)
  }

  for (const routeQuote of candidateRouteQuotes) {
    const { pools } = routeQuote
    const poolAddresses = pools.map(getPoolAddress)

    if (poolAddresses.some((poolAddress) => poolAddressSet.has(poolAddress))) {
      continue
    }

    return routeQuote
  }

  return null
}
