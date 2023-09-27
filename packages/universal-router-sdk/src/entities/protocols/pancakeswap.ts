import { Pair, TradeType, validateAndParseAddress } from '@pancakeswap/sdk'
import { BaseRoute, RouteType, SmartRouter, SmartRouterTrade, StablePool } from '@pancakeswap/smart-router/evm'
import { ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../utils/constants'
import { encodeFeeBips } from '../../utils/numbers'
import { CommandType, RoutePlanner } from '../../utils/routerCommands'
import { ABIParametersType, AnyTradeType, PancakeSwapOptions } from '../../utils/types'
import { Command, RouterTradeType, TradeConfig } from '../Command'

// Wrapper for pancakeswap router-sdk trade entity to encode swaps for Universal Router
// also translates trade objects from previous (v2, v3) SDKs
export class PancakeSwapTrade implements Command {
  readonly tradeType: RouterTradeType = RouterTradeType.PancakeSwapTrade

  readonly type: TradeType

  constructor(public trade: AnyTradeType, public options: PancakeSwapOptions) {
    this.type = (this.trade as SmartRouterTrade<TradeType>).tradeType
  }

  encode(planner: RoutePlanner, _config: TradeConfig): void {
    let payerIsUser = true
    const trades = !Array.isArray(this.trade) ? [this.trade] : this.trade
    const numberOfTrades = trades.reduce((numOfTrades, trade) => numOfTrades + trade.routes.length, 0)

    const sampleTrade = trades[0]
    // If the input currency is the native currency, we need to wrap it with the router as the recipient
    if (sampleTrade.inputAmount.currency.isNative) {
      // TODO: optimize if only one v2 pool we can directly send this to the pool
      planner.addCommand(CommandType.WRAP_ETH, [
        ROUTER_AS_RECIPIENT,
        BigInt(
          SmartRouter.maximumAmountIn(
            sampleTrade,
            this.options.slippageTolerance,
            sampleTrade.inputAmount
          ).quotient.toString()
        ),
      ])
      // since WETH is now owned by the router, the router pays for inputs
      payerIsUser = false
    }
    // The overall recipient at the end of the trade, SENDER_AS_RECIPIENT uses the msg.sender
    this.options.recipient = this.options.recipient ?? SENDER_AS_RECIPIENT

    const inputIsNative = sampleTrade.inputAmount.currency.isNative
    const outputIsNative = sampleTrade.outputAmount.currency.isNative
    const performAggregatedSlippageCheck = sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
    const routerMustCustody = outputIsNative || !!this.options.fee || performAggregatedSlippageCheck

    for (const trade of trades) {
      if (trade.routes.length === 1 && trade.routes[0].type === RouteType.V2) {
        addV2Swap(
          planner,
          trade as SmartRouterTrade<TradeType>,
          this.options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      } else if (trade.routes.every((r) => r.type === RouteType.V3)) {
        addV3Swap(
          planner,
          trade as SmartRouterTrade<TradeType>,
          this.options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      } else if (trade.routes.every((r) => r.type === RouteType.V3)) {
        addMixedSwap(
          planner,
          trade as SmartRouterTrade<TradeType>,
          this.options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      } else {
        addMixedSwap(
          planner,
          trade as SmartRouterTrade<TradeType>,
          this.options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      }
    }
    // const ZERO_OUT: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0)
    // const minAmountOut: CurrencyAmount<Currency> = trades.reduce(
    //   (sum, trade) => sum.add(minimumAmountOut(trade, options.slippageTolerance)),
    //   ZERO_OUT,
    // )

    let minAmountOut = SmartRouter.minimumAmountOut(trades[0], this.options.slippageTolerance, trades[0].outputAmount)
    // The router custodies for 3 reasons: to unwrap, to take a fee, and/or to do a slippage check
    if (routerMustCustody) {
      // If there is a fee, that percentage is sent to the fee recipient
      // In the case where ETH is the output currency, the fee is taken in WETH (for gas reasons)
      if (this.options.fee) {
        const feeBips = BigInt(encodeFeeBips(this.options.fee.fee))
        planner.addCommand(CommandType.PAY_PORTION, [
          sampleTrade.outputAmount.currency.wrapped.address,
          this.options.fee.recipient,
          feeBips,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (this.type === TradeType.EXACT_OUTPUT) {
          minAmountOut = minAmountOut.subtract(minAmountOut.multiply(feeBips))
        }

        // The remaining tokens that need to be sent to the user after the fee is taken will be caught
        // by this if-else clause.
        if (outputIsNative) {
          planner.addCommand(CommandType.UNWRAP_WETH, [
            this.options.recipient,
            BigInt(minAmountOut.quotient.toString()),
          ])
        } else {
          planner.addCommand(CommandType.SWEEP, [
            sampleTrade.outputAmount.currency.wrapped.address,
            this.options.recipient,
            BigInt(minAmountOut.quotient.toString()),
          ])
        }
      }

      if (inputIsNative && this.type === TradeType.EXACT_OUTPUT) {
        // for exactOutput swaps that take native currency as input
        // we need to send back the change to the user
        planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, 0])
      }
    }
  }
}

// encode a v2 swap
function addV2Swap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  payerIsUser: boolean,
  performAggregatedSlippageCheck: boolean
): void {
  const amountIn = BigInt(SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient.toString())
  const amountOut = BigInt(SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient.toString())

  // V2 trade should have only one route
  const route = trade.routes[0]
  const path = route.path.map((token) => token.wrapped.address)
  const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

  // same as encodeV2Swap only we dont return calldatas instead we push to the command planner
  if (trade.tradeType == TradeType.EXACT_INPUT) {
    planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
      // if native, we have to unwrap so keep in the router for now
      recipient,
      amountIn,
      performAggregatedSlippageCheck ? 0n : amountOut,
      path,
      payerIsUser,
    ])
  } else if (trade.tradeType == TradeType.EXACT_OUTPUT) {
    planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [recipient, amountOut, amountIn, path, payerIsUser])
  }
}

// encode a v3 swap
async function addV3Swap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  payerIsUser: boolean,
  performAggregatedSlippageCheck: boolean
): Promise<void> {
  for (const route of trade.routes) {
    const { inputAmount, outputAmount } = route

    // we need to generaate v3 path as a hash string. we can still use encodeMixedRoute
    // as a v3 swap is essentially a for of mixedRoute
    const path = SmartRouter.encodeMixedRouteToPath(
      { ...route, input: inputAmount.currency, output: outputAmount.currency },
      trade.tradeType === TradeType.EXACT_OUTPUT
    )
    const amountIn = BigInt(SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient.toString())
    const amountOut = BigInt(SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient.toString())

    const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

    // similar to encodeV3Swap only we dont need to add a case for signle hop. by using ecodeMixedRoutePath
    // we can get the parthStr for all cases
    if (trade.tradeType === TradeType.EXACT_INPUT) {
      const exactInputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_IN> = [
        recipient,
        amountIn,
        performAggregatedSlippageCheck ? 0n : amountOut,
        path,
        payerIsUser,
      ]
      planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactInputSingleParams)
    } else {
      const exactOutputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_OUT> = [
        recipient,
        amountOut,
        amountIn,
        path,
        payerIsUser,
      ]
      planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, exactOutputSingleParams)
    }
  }
}

// encode a mixed route swap, i.e. including both v2 and v3 pools
async function addMixedSwap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  payerIsUser: boolean,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean
): Promise<void> {
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT

  for (const route of trade.routes) {
    const { inputAmount, outputAmount, pools } = route
    const amountIn: bigint = SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient
    const amountOut: bigint = SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient

    // flag for whether the trade is single hop or not
    const singleHop = pools.length === 1

    const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

    const mixedRouteIsAllV3 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
      return r.pools.every(SmartRouter.isV3Pool)
    }
    const mixedRouteIsAllV2 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
      return r.pools.every(SmartRouter.isV2Pool)
    }

    const mixedRouteIsAllStable = (r: Omit<BaseRoute, 'input' | 'output'>) => {
      return r.pools.every(SmartRouter.isStablePool)
    }

    // similar to encodeMixedRouteSwap but more simplified where we just continue
    // as if its a regular v2 or v3 trade
    if (singleHop) {
      if (mixedRouteIsAllV3(route)) {
        addV3Swap(
          planner,
          {
            ...trade,
            routes: [route],
            inputAmount,
            outputAmount,
          },
          options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      }
      if (mixedRouteIsAllV2(route)) {
        addV2Swap(
          planner,
          {
            ...trade,
            routes: [route],
            inputAmount,
            outputAmount,
          },
          options,
          routerMustCustody,
          payerIsUser,
          performAggregatedSlippageCheck
        )
      }
      if (mixedRouteIsAllStable(route)) {
        addStableSwap(
          planner,
          {
            ...trade,
            routes: [route],
            inputAmount,
            outputAmount,
          },
          options,
          routerMustCustody,
          performAggregatedSlippageCheck,
          payerIsUser
        )
      }
    } else {
      const sections = SmartRouter.partitionMixedRouteByProtocol(route)

      const isLastSectionInRoute = (i: number) => {
        return i === sections.length - 1
      }

      let outputToken
      let inputToken = inputAmount.currency.wrapped

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        /// Now, we get output of this section
        outputToken = SmartRouter.getOutputOfPools(section, inputToken)
        inputToken = outputToken.wrapped
        const newRoute = SmartRouter.buildBaseRoute([...section], inputToken, outputToken)

        const lastSectionInRoute = isLastSectionInRoute(i)
        const recipientAddress = isLastSectionInRoute(i)
          ? recipient
          : (sections[i + 1][0] as unknown as Pair).liquidityToken.address

        const inAmount = i === 0 ? amountIn : 0n
        const outAmount = !lastSectionInRoute ? 0n : amountOut

        if (mixedRouteIsAllV3(newRoute as BaseRoute)) {
          const pathStr = SmartRouter.encodeMixedRouteToPath(newRoute, !isExactIn)
          if (isExactIn) {
            planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
              recipientAddress,
              inAmount, // amountIn
              outAmount, // amountOut
              pathStr, // path
              payerIsUser && i === 0, // payerIsUser
            ])
          } else {
            planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
              recipientAddress,
              outAmount, // amountIn
              inAmount, // amountOut
              pathStr, // path
              payerIsUser && i === 0, // payerIsUser
            ])
          }
        } else if (mixedRouteIsAllV2(newRoute as BaseRoute)) {
          const path = newRoute.path.map((token) => token.wrapped.address)
          if (isExactIn) {
            planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
              recipientAddress, // recipient
              inAmount, // amountIn
              outAmount, // amountOutMin
              path, // path
              payerIsUser && i === 0,
            ])
          } else {
            planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
              recipientAddress, // recipient
              outAmount, // amountIn
              inAmount, // amountOutMin
              path, // path
              payerIsUser && i === 0,
            ])
          }
        } else if (mixedRouteIsAllStable(newRoute)) {
          const path = newRoute.path.map((token) => token.wrapped.address)
          // eslint-disable-next-line no-loop-func
          const flags = newRoute.pools.map((pool) => BigInt((pool as StablePool).balances.length))
          if (isExactIn) {
            planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, [
              recipientAddress,
              inAmount,
              outAmount,
              path,
              flags,
              payerIsUser && i === 0,
            ])
          } else {
            planner.addCommand(CommandType.STABLE_SWAP_EXACT_OUT, [
              recipientAddress,
              outAmount,
              inAmount,
              path,
              flags,
              payerIsUser && i === 0,
            ])
          }
        } else {
          throw new Error('Unsupported route')
        }
      }
    }
  }
}

async function addStableSwap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean,
  // @notice: stable swap inputToken will never be nativeToken
  payerIsUser = false
): Promise<void> {
  const amountIn: bigint = SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient
  const amountOut: bigint = SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient

  if (trade.routes.length > 1 || trade.routes[0].pools.some((p) => !SmartRouter.isStablePool(p))) {
    throw new Error('Unsupported trade to encode')
  }

  // Stable trade should have only one route
  const route = trade.routes[0]
  const path = route.path.map((token) => token.wrapped.address)
  const flags = route.pools.map((p) => BigInt((p as StablePool).balances.length))
  const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    const exactInputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_IN> = [
      recipient,
      amountIn,
      performAggregatedSlippageCheck ? 0n : amountOut,
      path,
      flags,
      payerIsUser,
    ]
    planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, exactInputParams)
  }

  const exactOutputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_IN> = [
    recipient,
    amountIn,
    amountOut,
    path,
    flags,
    payerIsUser,
  ]

  planner.addCommand(CommandType.STABLE_SWAP_EXACT_OUT, exactOutputParams)
}
