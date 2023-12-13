import { encodeFunctionData, Hex, Address } from 'viem'
import { Currency, CurrencyAmount, Percent, TradeType, validateAndParseAddress, WNATIVE } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { FeeOptions, MethodParameters, Payments, PermitOptions, Position, SelfPermit, toHex } from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'

import { swapRouter02Abi } from '../../abis/ISwapRouter02'
import { ADDRESS_THIS, MSG_SENDER } from '../../constants'
import { ApproveAndCall, ApprovalTypes, CondensedAddLiquidityOptions } from './approveAndCall'
import { SmartRouterTrade, V3Pool, BaseRoute, RouteType, StablePool } from '../types'
import { MulticallExtended, Validation } from './multicallExtended'
import { PaymentsExtended } from './paymentsExtended'
import { encodeMixedRouteToPath } from './encodeMixedRouteToPath'
import { partitionMixedRouteByProtocol } from './partitionMixedRouteByProtocol'
import { maximumAmountIn, minimumAmountOut } from './maximumAmount'
import { isStablePool, isV2Pool, isV3Pool } from './pool'
import { buildBaseRoute } from './route'
import { getOutputOfPools } from './getOutputOfPools'
import { getPriceImpact } from './getPriceImpact'

const ZERO = 0n
const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(50n, 100n)

/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: Percent

  /**
   * The account that should receive the output. If omitted, output is sent to msg.sender.
   */
  recipient?: Address

  /**
   * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
   */
  deadlineOrPreviousBlockhash?: Validation

  /**
   * The optional permit parameters for spending the input.
   */
  inputTokenPermit?: PermitOptions

  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions
}

export interface SwapAndAddOptions extends SwapOptions {
  /**
   * The optional permit parameters for pulling in remaining output token.
   */
  outputTokenPermit?: PermitOptions
}

type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]

/**
 * Represents the Pancakeswap V2 + V3 + StableSwap SwapRouter02, and has static methods for helping execute trades.
 */
export abstract class SwapRouter {
  public static ABI = swapRouter02Abi

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * @notice Generates the calldata for a Swap with a V2 Route.
   * @param trade The V2Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeV2Swap(
    trade: SmartRouterTrade<TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): Hex {
    const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance).quotient
    const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance).quotient

    // V2 trade should have only one route
    const route = trade.routes[0]
    const path = route.path.map((token) => token.wrapped.address)
    const recipient = routerMustCustody
      ? ADDRESS_THIS
      : typeof options.recipient === 'undefined'
      ? MSG_SENDER
      : validateAndParseAddress(options.recipient)

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      const exactInputParams = [amountIn, performAggregatedSlippageCheck ? 0n : amountOut, path, recipient] as const

      return encodeFunctionData({
        abi: SwapRouter.ABI,
        functionName: 'swapExactTokensForTokens',
        args: exactInputParams,
      })
    }
    const exactOutputParams = [amountOut, amountIn, path, recipient] as const

    return encodeFunctionData({
      abi: SwapRouter.ABI,
      functionName: 'swapTokensForExactTokens',
      args: exactOutputParams,
    })
  }

  /**
   * @notice Generates the calldata for a Swap with a Stable Route.
   * @param trade The Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeStableSwap(
    trade: SmartRouterTrade<TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): Hex {
    const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance).quotient
    const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance).quotient

    if (trade.routes.length > 1 || trade.routes[0].pools.some((p) => !isStablePool(p))) {
      throw new Error('Unsupported trade to encode')
    }

    // Stable trade should have only one route
    const route = trade.routes[0]
    const path = route.path.map((token) => token.wrapped.address)
    const flags = route.pools.map((p) => BigInt((p as StablePool).balances.length))
    const recipient = routerMustCustody
      ? ADDRESS_THIS
      : typeof options.recipient === 'undefined'
      ? MSG_SENDER
      : validateAndParseAddress(options.recipient)

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      const exactInputParams = [
        path,
        flags,
        amountIn,
        performAggregatedSlippageCheck ? 0n : amountOut,
        recipient,
      ] as const
      return encodeFunctionData({
        abi: SwapRouter.ABI,
        functionName: 'exactInputStableSwap',
        args: exactInputParams,
      })
    }
    const exactOutputParams = [path, flags, amountOut, amountIn, recipient] as const

    return encodeFunctionData({
      abi: SwapRouter.ABI,
      functionName: 'exactOutputStableSwap',
      args: exactOutputParams,
    })
  }

  /**
   * @notice Generates the calldata for a Swap with a V3 Route.
   * @param trade The V3Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeV3Swap(
    trade: SmartRouterTrade<TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): Hex[] {
    const calldatas: Hex[] = []

    for (const route of trade.routes) {
      const { inputAmount, outputAmount, pools, path } = route
      const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
      const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient

      // flag for whether the trade is single hop or not
      const singleHop = pools.length === 1

      const recipient = routerMustCustody
        ? ADDRESS_THIS
        : typeof options.recipient === 'undefined'
        ? MSG_SENDER
        : validateAndParseAddress(options.recipient)

      if (singleHop) {
        if (trade.tradeType === TradeType.EXACT_INPUT) {
          const exactInputSingleParams = {
            tokenIn: path[0].wrapped.address,
            tokenOut: path[1].wrapped.address,
            fee: (pools[0] as V3Pool).fee,
            recipient,
            amountIn,
            amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut,
            sqrtPriceLimitX96: 0n,
          }

          calldatas.push(
            encodeFunctionData({
              abi: SwapRouter.ABI,
              functionName: 'exactInputSingle',
              args: [exactInputSingleParams],
            }),
          )
        } else {
          const exactOutputSingleParams = {
            tokenIn: path[0].wrapped.address,
            tokenOut: path[1].wrapped.address,
            fee: (pools[0] as V3Pool).fee,
            recipient,
            amountOut,
            amountInMaximum: amountIn,
            sqrtPriceLimitX96: 0n,
          }

          calldatas.push(
            encodeFunctionData({
              abi: SwapRouter.ABI,
              functionName: 'exactOutputSingle',
              args: [exactOutputSingleParams],
            }),
          )
        }
      } else {
        const pathStr = encodeMixedRouteToPath(
          { ...route, input: inputAmount.currency, output: outputAmount.currency },
          trade.tradeType === TradeType.EXACT_OUTPUT,
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          const exactInputParams = {
            path: pathStr,
            recipient,
            amountIn,
            amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut,
          }

          calldatas.push(
            encodeFunctionData({
              abi: SwapRouter.ABI,
              functionName: 'exactInput',
              args: [exactInputParams],
            }),
          )
        } else {
          const exactOutputParams = {
            path: pathStr,
            recipient,
            amountOut,
            amountInMaximum: amountIn,
          }

          calldatas.push(
            encodeFunctionData({
              abi: SwapRouter.ABI,
              functionName: 'exactOutput',
              args: [exactOutputParams],
            }),
          )
        }
      }
    }

    return calldatas
  }

  /**
   * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will instead generate
   *         them via the existing encodeV3Swap and encodeV2Swap methods.
   * @param trade The MixedRouteTrade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeMixedRouteSwap(
    trade: SmartRouterTrade<TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): Hex[] {
    let calldatas: Hex[] = []

    const isExactIn = trade.tradeType === TradeType.EXACT_INPUT

    for (const route of trade.routes) {
      const { inputAmount, outputAmount, pools } = route
      const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
      const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient

      // flag for whether the trade is single hop or not
      const singleHop = pools.length === 1

      const recipient = routerMustCustody
        ? ADDRESS_THIS
        : typeof options.recipient === 'undefined'
        ? MSG_SENDER
        : validateAndParseAddress(options.recipient)

      const mixedRouteIsAllV3 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
        return r.pools.every(isV3Pool)
      }
      const mixedRouteIsAllV2 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
        return r.pools.every(isV2Pool)
      }
      const mixedRouteIsAllStable = (r: Omit<BaseRoute, 'input' | 'output'>) => {
        return r.pools.every(isStablePool)
      }

      if (singleHop) {
        /// For single hop, since it isn't really a mixedRoute, we'll just mimic behavior of V3 or V2
        /// We don't use encodeV3Swap() or encodeV2Swap() because casting the trade to a V3Trade or V2Trade is overcomplex
        if (mixedRouteIsAllV3(route)) {
          calldatas = [
            ...calldatas,
            ...SwapRouter.encodeV3Swap(
              {
                ...trade,
                routes: [route],
                inputAmount,
                outputAmount,
              },
              options,
              routerMustCustody,
              performAggregatedSlippageCheck,
            ),
          ]
        } else if (mixedRouteIsAllV2(route)) {
          calldatas = [
            ...calldatas,
            SwapRouter.encodeV2Swap(
              {
                ...trade,
                routes: [route],
                inputAmount,
                outputAmount,
              },
              options,
              routerMustCustody,
              performAggregatedSlippageCheck,
            ),
          ]
        } else if (mixedRouteIsAllStable(route)) {
          calldatas = [
            ...calldatas,
            SwapRouter.encodeStableSwap(
              {
                ...trade,
                routes: [route],
                inputAmount,
                outputAmount,
              },
              options,
              routerMustCustody,
              performAggregatedSlippageCheck,
            ),
          ]
        } else {
          throw new Error('Unsupported route to encode')
        }
      } else {
        const sections = partitionMixedRouteByProtocol(route)

        const isLastSectionInRoute = (i: number) => {
          return i === sections.length - 1
        }

        let outputToken
        let inputToken = inputAmount.currency.wrapped

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i]
          /// Now, we get output of this section
          outputToken = getOutputOfPools(section, inputToken)

          const newRoute = buildBaseRoute([...section], inputToken, outputToken)

          /// Previous output is now input
          inputToken = outputToken.wrapped

          const lastSectionInRoute = isLastSectionInRoute(i)
          // By default router holds funds until the last swap, then it is sent to the recipient
          // special case exists where we are unwrapping WETH output, in which case `routerMustCustody` is set to true
          // and router still holds the funds. That logic bundled into how the value of `recipient` is calculated
          const recipientAddress = lastSectionInRoute ? recipient : ADDRESS_THIS
          const inAmount = i === 0 ? amountIn : 0n
          const outAmount = !lastSectionInRoute ? 0n : amountOut
          if (mixedRouteIsAllV3(newRoute)) {
            const pathStr = encodeMixedRouteToPath(newRoute, !isExactIn)
            if (isExactIn) {
              const exactInputParams = {
                path: pathStr,
                recipient: recipientAddress,
                amountIn: inAmount,
                amountOutMinimum: outAmount,
              }
              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'exactInput',
                  args: [exactInputParams],
                }),
              )
            } else {
              const exactOutputParams = {
                path: pathStr,
                recipient,
                amountOut: outAmount,
                amountInMaximum: inAmount,
              }

              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'exactOutput',
                  args: [exactOutputParams],
                }),
              )
            }
          } else if (mixedRouteIsAllV2(newRoute)) {
            const path = newRoute.path.map((token) => token.wrapped.address)
            if (isExactIn) {
              const exactInputParams = [
                inAmount, // amountIn
                outAmount, // amountOutMin
                path, // path
                recipientAddress, // to
              ] as const

              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'swapExactTokensForTokens',
                  args: exactInputParams,
                }),
              )
            } else {
              const exactOutputParams = [outAmount, inAmount, path, recipientAddress] as const

              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'swapTokensForExactTokens',
                  args: exactOutputParams,
                }),
              )
            }
          } else if (mixedRouteIsAllStable(newRoute)) {
            const path = newRoute.path.map((token) => token.wrapped.address)
            // eslint-disable-next-line no-loop-func
            const flags = newRoute.pools.map((pool) => BigInt((pool as StablePool).balances.length))
            if (isExactIn) {
              const exactInputParams = [
                path, // path
                flags, // stable pool types
                inAmount, // amountIn
                outAmount, // amountOutMin
                recipientAddress, // to
              ] as const

              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'exactInputStableSwap',
                  args: exactInputParams,
                }),
              )
            } else {
              const exactOutputParams = [path, flags, outAmount, inAmount, recipientAddress] as const

              calldatas.push(
                encodeFunctionData({
                  abi: SwapRouter.ABI,
                  functionName: 'exactOutputStableSwap',
                  args: exactOutputParams,
                }),
              )
            }
          } else {
            throw new Error('Unsupported route')
          }
        }
      }
    }

    return calldatas
  }

  private static encodeSwaps(
    anyTrade: AnyTradeType,
    options: SwapOptions,
    isSwapAndAdd?: boolean,
  ): {
    calldatas: Hex[]
    sampleTrade: SmartRouterTrade<TradeType>
    routerMustCustody: boolean
    inputIsNative: boolean
    outputIsNative: boolean
    totalAmountIn: CurrencyAmount<Currency>
    minimumAmountOut: CurrencyAmount<Currency>
    quoteAmountOut: CurrencyAmount<Currency>
  } {
    const trades = !Array.isArray(anyTrade) ? [anyTrade] : anyTrade

    const numberOfTrades = trades.reduce((numOfTrades, trade) => numOfTrades + trade.routes.length, 0)

    const sampleTrade = trades[0]

    // All trades should have the same starting/ending currency and trade type
    invariant(
      trades.every((trade) => trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency)),
      'TOKEN_IN_DIFF',
    )
    invariant(
      trades.every((trade) => trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency)),
      'TOKEN_OUT_DIFF',
    )
    invariant(
      trades.every((trade) => trade.tradeType === sampleTrade.tradeType),
      'TRADE_TYPE_DIFF',
    )

    const calldatas: Hex[] = []

    const inputIsNative = sampleTrade.inputAmount.currency.isNative
    const outputIsNative = sampleTrade.outputAmount.currency.isNative

    // flag for whether we want to perform an aggregated slippage check
    //   1. when there are >2 exact input trades. this is only a heuristic,
    //      as it's still more gas-expensive even in this case, but has benefits
    //      in that the reversion probability is lower
    const performAggregatedSlippageCheck = sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
    // flag for whether funds should be send first to the router
    //   1. when receiving ETH (which much be unwrapped from WETH)
    //   2. when a fee on the output is being taken
    //   3. when performing swap and add
    //   4. when performing an aggregated slippage check
    const routerMustCustody = outputIsNative || !!options.fee || !!isSwapAndAdd || performAggregatedSlippageCheck

    // encode permit if necessary
    if (options.inputTokenPermit) {
      invariant(sampleTrade.inputAmount.currency.isToken, 'NON_TOKEN_PERMIT')
      calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit))
    }

    for (const trade of trades) {
      if (trade.routes.length === 1 && trade.routes[0].type === RouteType.V2) {
        calldatas.push(SwapRouter.encodeV2Swap(trade, options, routerMustCustody, performAggregatedSlippageCheck))
      } else if (trade.routes.every((r) => r.type === RouteType.V3)) {
        for (const calldata of SwapRouter.encodeV3Swap(
          trade,
          options,
          routerMustCustody,
          performAggregatedSlippageCheck,
        )) {
          calldatas.push(calldata)
        }
      } else {
        for (const calldata of SwapRouter.encodeMixedRouteSwap(
          trade,
          options,
          routerMustCustody,
          performAggregatedSlippageCheck,
        )) {
          calldatas.push(calldata)
        }
      }
    }

    const ZERO_IN: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.inputAmount.currency, 0)
    const ZERO_OUT: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0)

    const minAmountOut: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) => sum.add(minimumAmountOut(trade, options.slippageTolerance)),
      ZERO_OUT,
    )

    const quoteAmountOut: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) => sum.add(trade.outputAmount),
      ZERO_OUT,
    )

    const totalAmountIn: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) => sum.add(maximumAmountIn(trade, options.slippageTolerance)),
      ZERO_IN,
    )

    return {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut: minAmountOut,
      quoteAmountOut,
    }
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(trades: AnyTradeType, options: SwapOptions): MethodParameters {
    const {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut: minAmountOut,
    } = SwapRouter.encodeSwaps(trades, options)

    // unwrap or sweep
    if (routerMustCustody) {
      if (outputIsNative) {
        calldatas.push(PaymentsExtended.encodeUnwrapWETH9(minAmountOut.quotient, options.recipient, options.fee))
      } else {
        calldatas.push(
          PaymentsExtended.encodeSweepToken(
            sampleTrade.outputAmount.currency.wrapped,
            minAmountOut.quotient,
            options.recipient,
            options.fee,
          ),
        )
      }
    }

    // must refund when paying in ETH: either with an uncertain input amount OR if there's a chance of a partial fill.
    // unlike ERC20's, the full ETH value must be sent in the transaction, so the rest must be refunded.
    if (inputIsNative && (sampleTrade.tradeType === TradeType.EXACT_OUTPUT || SwapRouter.riskOfPartialFill(trades))) {
      calldatas.push(Payments.encodeRefundETH())
    }

    return {
      calldata: MulticallExtended.encodeMulticall(calldatas, options.deadlineOrPreviousBlockhash),
      value: toHex(inputIsNative ? totalAmountIn.quotient : ZERO),
    }
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapAndAddCallParameters(
    trades: AnyTradeType,
    options: SwapAndAddOptions,
    position: Position,
    addLiquidityOptions: CondensedAddLiquidityOptions,
    tokenInApprovalType: ApprovalTypes,
    tokenOutApprovalType: ApprovalTypes,
  ): MethodParameters {
    const {
      calldatas,
      inputIsNative,
      outputIsNative,
      sampleTrade,
      totalAmountIn: totalAmountSwapped,
      quoteAmountOut,
      minimumAmountOut: minAmountOut,
    } = SwapRouter.encodeSwaps(trades, options, true)

    // encode output token permit if necessary
    if (options.outputTokenPermit) {
      invariant(quoteAmountOut.currency.isToken, 'NON_TOKEN_PERMIT_OUTPUT')
      calldatas.push(SelfPermit.encodePermit(quoteAmountOut.currency, options.outputTokenPermit))
    }

    const {
      inputAmount: {
        currency: { chainId },
      },
    } = sampleTrade
    const zeroForOne = position.pool.token0.wrapped.address === totalAmountSwapped.currency.wrapped.address
    const { positionAmountIn, positionAmountOut } = SwapRouter.getPositionAmounts(position, zeroForOne)

    // if tokens are native they will be converted to WETH9
    const tokenIn = inputIsNative ? WNATIVE[chainId as ChainId] : positionAmountIn.currency.wrapped
    const tokenOut = outputIsNative ? WNATIVE[chainId as ChainId] : positionAmountOut.currency.wrapped

    // if swap output does not make up whole outputTokenBalanceDesired, pull in remaining tokens for adding liquidity
    const amountOutRemaining = positionAmountOut.subtract(quoteAmountOut.wrapped)
    if (amountOutRemaining.greaterThan(CurrencyAmount.fromRawAmount(positionAmountOut.currency, 0))) {
      // if output is native, this means the remaining portion is included as native value in the transaction
      // and must be wrapped. Otherwise, pull in remaining ERC20 token.
      if (outputIsNative) {
        calldatas.push(PaymentsExtended.encodeWrapETH(amountOutRemaining.quotient))
      } else {
        calldatas.push(PaymentsExtended.encodePull(tokenOut, amountOutRemaining.quotient))
      }
    }

    // if input is native, convert to WETH9, else pull ERC20 token
    if (inputIsNative) {
      calldatas.push(PaymentsExtended.encodeWrapETH(positionAmountIn.quotient))
    } else {
      calldatas.push(PaymentsExtended.encodePull(tokenIn, positionAmountIn.quotient))
    }

    // approve token balances to NFTManager
    if (tokenInApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(ApproveAndCall.encodeApprove(tokenIn, tokenInApprovalType))
    if (tokenOutApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(ApproveAndCall.encodeApprove(tokenOut, tokenOutApprovalType))

    // represents a position with token amounts resulting from a swap with maximum slippage
    // hence the minimal amount out possible.
    const minimalPosition = Position.fromAmounts({
      pool: position.pool,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      amount0: zeroForOne ? position.amount0.quotient.toString() : minAmountOut.quotient.toString(),
      amount1: zeroForOne ? minAmountOut.quotient.toString() : position.amount1.quotient.toString(),
      useFullPrecision: false,
    })

    // encode NFTManager add liquidity
    calldatas.push(
      ApproveAndCall.encodeAddLiquidity(position, minimalPosition, addLiquidityOptions, options.slippageTolerance),
    )

    // sweep remaining tokens
    if (inputIsNative) {
      calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
    } else {
      calldatas.push(PaymentsExtended.encodeSweepToken(tokenIn, ZERO))
    }
    if (outputIsNative) {
      calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
    } else {
      calldatas.push(PaymentsExtended.encodeSweepToken(tokenOut, ZERO))
    }

    let value: bigint
    if (inputIsNative) {
      value = totalAmountSwapped.wrapped.add(positionAmountIn.wrapped).quotient
    } else if (outputIsNative) {
      value = amountOutRemaining.quotient
    } else {
      value = ZERO
    }

    return {
      calldata: MulticallExtended.encodeMulticall(calldatas, options.deadlineOrPreviousBlockhash),
      value: toHex(value.toString()),
    }
  }

  // if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
  public static riskOfPartialFill(trades: AnyTradeType): boolean {
    if (Array.isArray(trades)) {
      return trades.some((trade) => {
        return SwapRouter.v3TradeWithHighPriceImpact(trade)
      })
    }
    return SwapRouter.v3TradeWithHighPriceImpact(trades)
  }

  private static v3TradeWithHighPriceImpact(trade: SmartRouterTrade<TradeType>): boolean {
    return (
      !(trade.routes.length === 1 && trade.routes[0].type === RouteType.V2) &&
      getPriceImpact(trade).greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
    )
  }

  private static getPositionAmounts(
    position: Position,
    zeroForOne: boolean,
  ): {
    positionAmountIn: CurrencyAmount<Currency>
    positionAmountOut: CurrencyAmount<Currency>
  } {
    const { amount0, amount1 } = position.mintAmounts
    const currencyAmount0 = CurrencyAmount.fromRawAmount(position.pool.token0, amount0)
    const currencyAmount1 = CurrencyAmount.fromRawAmount(position.pool.token1, amount1)

    const [positionAmountIn, positionAmountOut] = zeroForOne
      ? [currencyAmount0, currencyAmount1]
      : [currencyAmount1, currencyAmount0]
    return { positionAmountIn, positionAmountOut }
  }
}
