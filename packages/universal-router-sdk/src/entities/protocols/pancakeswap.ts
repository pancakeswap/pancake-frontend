import { Currency, Percent, TradeType, validateAndParseAddress } from '@pancakeswap/sdk'
import {
  BaseRoute,
  RouteType,
  SmartRouter,
  SmartRouterTrade,
  StablePool,
  getPoolAddress,
} from '@pancakeswap/smart-router/evm'
import invariant from 'tiny-invariant'
import { Address } from 'viem'

import { CONTRACT_BALANCE, ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../utils/constants'
import { encodeFeeBips } from '../../utils/numbers'
import { ABIParametersType, CommandType, RoutePlanner } from '../../utils/routerCommands'
import { Command, RouterTradeType } from '../Command'
import { PancakeSwapOptions } from '../types'

// Wrapper for pancakeswap router-sdk trade entity to encode swaps for Universal Router
export class PancakeSwapTrade implements Command {
  readonly tradeType: RouterTradeType = RouterTradeType.PancakeSwapTrade

  readonly type: TradeType

  constructor(public trade: SmartRouterTrade<TradeType>, public options: PancakeSwapOptions) {
    this.type = this.trade.tradeType
  }

  encode(planner: RoutePlanner): void {
    let payerIsUser = true
    const trade: SmartRouterTrade<TradeType> = this.trade
    const numberOfTrades = trade.routes.length

    // If the input currency is the native currency, we need to wrap it with the router as the recipient
    if (trade.inputAmount.currency.isNative) {
      // TODO: optimize if only one v2 pool we can directly send this to the pool
      planner.addCommand(CommandType.WRAP_ETH, [
        ROUTER_AS_RECIPIENT,
        BigInt(
          SmartRouter.maximumAmountIn(trade, this.options.slippageTolerance, trade.inputAmount).quotient.toString(),
        ),
      ])
      // since WETH is now owned by the router, the router pays for inputs
      payerIsUser = false
    }
    // The overall recipient at the end of the trade, SENDER_AS_RECIPIENT uses the msg.sender
    this.options.recipient = this.options.recipient ?? SENDER_AS_RECIPIENT

    const inputIsNative = trade.inputAmount.currency.isNative
    const outputIsNative = trade.outputAmount.currency.isNative
    const performAggregatedSlippageCheck = trade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
    const routerMustCustody = outputIsNative || !!this.options.fee || performAggregatedSlippageCheck

    for (const route of trade.routes) {
      const singleRouteTrade: SmartRouterTrade<TradeType> = {
        ...trade,
        routes: [route],
        inputAmount: route.inputAmount,
        outputAmount: route.outputAmount,
      }
      if (route.type === RouteType.V2) {
        addV2Swap(planner, singleRouteTrade, this.options, routerMustCustody, payerIsUser)
        continue
      }
      if (route.type === RouteType.V3) {
        addV3Swap(planner, singleRouteTrade, this.options, routerMustCustody, payerIsUser)
        continue
      }
      if (route.type === RouteType.STABLE) {
        addStableSwap(planner, singleRouteTrade, this.options, routerMustCustody, payerIsUser)
        continue
      }
      addMixedSwap(planner, singleRouteTrade, this.options, payerIsUser, routerMustCustody)
    }

    let minAmountOut = SmartRouter.minimumAmountOut(trade, this.options.slippageTolerance, trade.outputAmount)
    // The router custodies for 3 reasons: to unwrap, to take a fee, and/or to do a slippage check
    if (routerMustCustody) {
      // If there is a fee, that percentage is sent to the fee recipient
      // In the case where ETH is the output currency, the fee is taken in WETH (for gas reasons)
      if (this.options.fee) {
        const feeBips = BigInt(encodeFeeBips(this.options.fee.fee))
        planner.addCommand(CommandType.PAY_PORTION, [
          trade.outputAmount.currency.wrapped.address,
          this.options.fee.recipient,
          feeBips,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (this.type === TradeType.EXACT_OUTPUT) {
          minAmountOut = minAmountOut.subtract(minAmountOut.multiply(feeBips).divide(10000))
        }
      }

      // TODO: missing flatFee

      // The remaining tokens that need to be sent to the user after the fee is taken will be caught
      // by this if-else clause.
      if (outputIsNative) {
        planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, minAmountOut.quotient])
      } else {
        planner.addCommand(CommandType.SWEEP, [
          trade.outputAmount.currency.wrapped.address,
          this.options.recipient,
          minAmountOut.quotient,
        ])
      }
    }

    if (inputIsNative && (this.type === TradeType.EXACT_OUTPUT || riskOfPartialFill(trade))) {
      // for exactOutput swaps that take native currency as input
      // we need to send back the change to the user
      planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, 0n])
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
): void {
  const amountIn = BigInt(SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient.toString())
  const amountOut = BigInt(SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient.toString())

  invariant(trade.routes.length === 1 && trade.routes[0].type === RouteType.V2, 'Only allow single route v2 trade')

  // V2 trade should have only one route
  const [route] = trade.routes
  const path = route.path.map((token) => token.wrapped.address)

  const recipient = routerMustCustody
    ? ROUTER_AS_RECIPIENT
    : validateAndParseAddress(options.recipient ?? SENDER_AS_RECIPIENT)

  // same as encodeV2Swap only we dont return calldatas instead we push to the command planner
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
      // if native, we have to unwrap so keep in the router for now
      recipient,
      amountIn,
      amountOut,
      path,
      payerIsUser,
    ])
    return
  }

  planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [recipient, amountOut, amountIn, path, payerIsUser])
}

// encode a v3 swap
function addV3Swap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  payerIsUser: boolean,
): void {
  invariant(trade.routes.length === 1 && trade.routes[0].type === RouteType.V3, 'Only allow single route v3 trade')
  const [route] = trade.routes

  const { inputAmount, outputAmount } = route

  // we need to generaate v3 path as a hash string. we can still use encodeMixedRoute
  // as a v3 swap is essentially a for of mixedRoute
  const path = SmartRouter.encodeMixedRouteToPath(
    { ...route, input: inputAmount.currency, output: outputAmount.currency },
    trade.tradeType === TradeType.EXACT_OUTPUT,
  )
  const amountIn: bigint = SmartRouter.maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
  const amountOut: bigint = SmartRouter.minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient

  const recipient = routerMustCustody
    ? ROUTER_AS_RECIPIENT
    : validateAndParseAddress(options.recipient ?? SENDER_AS_RECIPIENT)

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    const exactInputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_IN> = [
      recipient,
      amountIn,
      amountOut,
      path,
      payerIsUser,
    ]
    planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactInputSingleParams)
    return
  }

  const exactOutputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_OUT> = [
    recipient,
    amountOut,
    amountIn,
    path,
    payerIsUser,
  ]
  planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, exactOutputSingleParams)
}

function addStableSwap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  // @notice: stable swap inputToken will never be nativeToken
  payerIsUser = false,
): void {
  invariant(
    trade.routes.length === 1 && trade.routes[0].type === RouteType.STABLE,
    'Only allow single route stable trade',
  )

  const amountIn = SmartRouter.maximumAmountIn(trade, options.slippageTolerance).quotient
  const amountOut = SmartRouter.minimumAmountOut(trade, options.slippageTolerance).quotient

  const [route] = trade.routes
  const path = route.path.map((token) => token.wrapped.address)
  const flags = route.pools.map((p) => BigInt((p as StablePool).balances.length))
  const recipient = routerMustCustody
    ? ROUTER_AS_RECIPIENT
    : validateAndParseAddress(options.recipient ?? SENDER_AS_RECIPIENT)

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    const exactInputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_IN> = [
      recipient,
      amountIn,
      amountOut,
      path,
      flags,
      payerIsUser,
    ]
    planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, exactInputParams)
    return
  }

  const exactOutputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_OUT> = [
    recipient,
    amountOut,
    amountIn,
    path,
    flags,
    payerIsUser,
  ]

  planner.addCommand(CommandType.STABLE_SWAP_EXACT_OUT, exactOutputParams)
}

// encode a mixed route swap, i.e. including both v2 and v3 pools
function addMixedSwap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  payerIsUser: boolean,
  routerMustCustody: boolean,
): void {
  invariant(
    trade.routes.length === 1 && trade.routes[0].type === RouteType.MIXED,
    'Only allow single route mixed trade',
  )

  const [route] = trade.routes
  const { inputAmount, outputAmount } = route
  const amountIn: bigint = SmartRouter.maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
  const amountOut: bigint = SmartRouter.minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient

  const recipient = routerMustCustody
    ? ROUTER_AS_RECIPIENT
    : validateAndParseAddress(options.recipient ?? SENDER_AS_RECIPIENT)

  const mixedRouteIsAllV3 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
    return r.pools.every(SmartRouter.isV3Pool)
  }
  const mixedRouteIsAllV2 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
    return r.pools.every(SmartRouter.isV2Pool)
  }
  const mixedRouteIsAllStable = (r: Omit<BaseRoute, 'input' | 'output'>) => {
    return r.pools.every(SmartRouter.isStablePool)
  }

  // Check if a mixed route is actually pure v2, v3 or stable route.
  // If that's the case then let the corresponding command adder to handle the encode
  if (mixedRouteIsAllV3(route)) {
    addV3Swap(
      planner,
      {
        ...trade,
        routes: [
          {
            ...route,
            type: RouteType.V3,
          },
        ],
        inputAmount,
        outputAmount,
      },
      options,
      routerMustCustody,
      payerIsUser,
    )
    return
  }
  if (mixedRouteIsAllV2(route)) {
    addV2Swap(
      planner,
      {
        ...trade,
        routes: [
          {
            ...route,
            type: RouteType.V2,
          },
        ],
        inputAmount,
        outputAmount,
      },
      options,
      routerMustCustody,
      payerIsUser,
    )
    return
  }
  if (mixedRouteIsAllStable(route)) {
    addStableSwap(
      planner,
      {
        ...trade,
        routes: [
          {
            ...route,
            type: RouteType.STABLE,
          },
        ],
        inputAmount,
        outputAmount,
      },
      options,
      routerMustCustody,
      payerIsUser,
    )
    return
  }

  invariant(trade.tradeType === TradeType.EXACT_INPUT, 'Exact output is not supported for mixed route trade')

  const sections = SmartRouter.partitionMixedRouteByProtocol(route)

  let outputToken: Currency | undefined
  let inputToken = inputAmount.currency.wrapped

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const nextSection = sections[i + 1] ?? []
    const isFirstSection = i === 0
    const isLastSection = i === sections.length - 1

    const nextIsV2 = nextSection.length && nextSection.every(SmartRouter.isV2Pool)

    const getRecipient = (): Address => {
      if (isLastSection) return recipient
      if (nextIsV2) {
        const address = getPoolAddress(nextSection[0])
        if (!address) throw new Error('unknown v2 pool address')
        return address
      }
      return ROUTER_AS_RECIPIENT
    }
    const currentRecipient = getRecipient()

    // Now, we get output of this section
    outputToken = SmartRouter.getOutputOfPools(section, inputToken)
    const newRoute = SmartRouter.buildBaseRoute([...section], inputToken, outputToken)
    inputToken = outputToken.wrapped

    const payByUser = payerIsUser && isFirstSection

    const inAmount = isFirstSection ? amountIn : CONTRACT_BALANCE
    const outAmount = isLastSection ? amountOut : 0n

    switch (newRoute.type) {
      case RouteType.V3: {
        const path = SmartRouter.encodeMixedRouteToPath(newRoute, false)
        planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [currentRecipient, inAmount, outAmount, path, payByUser])
        break
      }
      case RouteType.V2: {
        const path = newRoute.path.map((token) => token.wrapped.address)
        planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [currentRecipient, inAmount, outAmount, path, payByUser])
        break
      }
      case RouteType.STABLE: {
        const path = newRoute.path.map((token) => token.wrapped.address)
        const flags = (newRoute.pools as StablePool[]).map((pool) => BigInt(pool.balances.length))
        planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, [
          currentRecipient,
          inAmount,
          outAmount,
          path,
          flags,
          payByUser,
        ])
        break
      }
      default:
        throw new RangeError('Unexpected route type')
    }
  }
}

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(50, 100)

// if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
function riskOfPartialFill(trade: SmartRouterTrade<TradeType>): boolean {
  return SmartRouter.getPriceImpact(trade).greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
}
