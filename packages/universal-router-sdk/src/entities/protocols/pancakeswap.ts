import { Currency, CurrencyAmount, TradeType, validateAndParseAddress } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/dist/evm/index'
import { Pair } from '@pancakeswap/sdk'
import { BaseRoute } from '@pancakeswap/smart-router/dist/evm/index'
import { PancakeSwapOptions } from '../../../test/utils/pancakeswapData'
import { ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../utils/constants'
import { encodeFeeBips } from '../../utils/numbers'
import { CommandType, RoutePlanner } from '../../utils/routerCommands'
import { AnyTradeType, RouteType } from '../../utils/types'
import { Command, RouterTradeType, TradeConfig } from '../Command'

import {
  buildBaseRoute,
  encodeMixedRouteToPath,
  getOutputOfPools,
  isV2Pool,
  isV3Pool,
  maximumAmountIn,
  minimumAmountOut,
  partitionMixedRouteByProtocol,
} from '../../utils/utils'
import { NativeCurrency } from '@pancakeswap/sdk'

// Wrapper for pancakeswap router-sdk trade entity to encode swaps for Universal Router
// also translates trade objects from previous (v2, v3) SDKs
export class PanckeSwapTrade implements Command {
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
        maximumAmountIn(sampleTrade, this.options.slippageTolerance, sampleTrade.inputAmount).quotient.toString(),
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
        addV2Swap(planner, trade as SmartRouterTrade<TradeType>, this.options, routerMustCustody, payerIsUser, performAggregatedSlippageCheck)
      } else if (trade.routes.every((r) => r.type === RouteType.V3)) {
        addV3Swap(planner, trade as SmartRouterTrade<TradeType>, this.options, routerMustCustody, payerIsUser, performAggregatedSlippageCheck)
      } else {
        addMixedSwap(planner, trade as SmartRouterTrade<TradeType>, this.options, routerMustCustody, payerIsUser, performAggregatedSlippageCheck)
      }
    }
    const ZERO_OUT: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0)

    let minAmountOut = minimumAmountOut(trades[0], this.options.slippageTolerance, trades[0].outputAmount).quotient.toString()
    // The router custodies for 3 reasons: to unwrap, to take a fee, and/or to do a slippage check
    if (routerMustCustody) {
      // If there is a fee, that percentage is sent to the fee recipient
      // In the case where ETH is the output currency, the fee is taken in WETH (for gas reasons)
      if (!!this.options.fee) {
        const feeBips = encodeFeeBips(this.options.fee.fee)
        planner.addCommand(CommandType.PAY_PORTION, [
          sampleTrade.outputAmount.currency.wrapped.address,
          this.options.fee.recipient,
          feeBips,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (this.type === TradeType.EXACT_OUTPUT) {
          minAmountOut = minAmountOut.subtract(minAmountOut.multiply(feeBips).divide(10000))
        }
      }

      // The remaining tokens that need to be sent to the user after the fee is taken will be caught
      // by this if-else clause.
      if (outputIsNative) {
        planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, minAmountOut])
      } else {
        planner.addCommand(CommandType.SWEEP, [
          sampleTrade.outputAmount.currency.wrapped.address,
          this.options.recipient,
          minAmountOut,
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

// encode a v2 swap
function addV2Swap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  payerIsUser: boolean,
      performAggregatedSlippageCheck: boolean,
): void {
  const amountIn = maximumAmountIn(trade, options.slippageTolerance).quotient.toString()
  const amountOut = minimumAmountOut(trade, options.slippageTolerance, trade.outputAmount).quotient.toString()
  // V2 trade should have only one route
  const route = trade.routes[0]
  const path = route.path.map((token) => token.wrapped.address)
  const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

  console.log('making v22222')
  //same as encodeV2Swap only we dont return calldatas instead we push to the command planner
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
    planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [path, amountOut, amountIn, path, payerIsUser])
  }
}

// encode a v3 swap
async function addV3Swap(
  planner: RoutePlanner,
  trade: SmartRouterTrade<TradeType>,
  options: PancakeSwapOptions,
  routerMustCustody: boolean,
  payerIsUser: boolean,
  performAggregatedSlippageCheck: boolean,

): Promise<void> {
  console.log('making v3332')

  for (const route of trade.routes) {
    const { inputAmount, outputAmount } = route

    // we need to generaate v3 path as a hash string. we can still use encodeMixedRoute
    // as a v3 swap is essentially a for of mixedRoute
    const path = encodeMixedRouteToPath(
      { ...route, input: inputAmount.currency, output: outputAmount.currency },
      trade.tradeType === TradeType.EXACT_OUTPUT
    )
    const amountIn = maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient.toString()
    const amountOut = minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient.toString()

    const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

    // similar to encodeV3Swap only we dont need to add a case for signle hop. by using ecodeMixedRoutePath
    // we can get the parthStr for all cases
    if (trade.tradeType === TradeType.EXACT_INPUT) {
      const exactInputSingleParams = [recipient, amountIn, performAggregatedSlippageCheck ? 0n : amountOut, path, payerIsUser]
      planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactInputSingleParams)
    } else {
      const exactOutputSingleParams = [recipient, amountOut, amountIn, path, payerIsUser]
      planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactOutputSingleParams)
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
  performAggregatedSlippageCheck: boolean,

): Promise<void> {
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT

  for (const route of trade.routes) {
    const { inputAmount, outputAmount, pools } = route
    const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
    const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient

    // flag for whether the trade is single hop or not
    const singleHop = pools.length === 1

    const recipient = routerMustCustody ? ROUTER_AS_RECIPIENT : validateAndParseAddress(options.recipient!)

    const mixedRouteIsAllV3 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
      return r.pools.every(isV3Pool)
    }
    const mixedRouteIsAllV2 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
      return r.pools.every(isV2Pool)
    }

    //similar to encodeMixedRouteSwap but more simplified where we just continue
    // as if its a regular v2 or v3 trade
    if (singleHop) {
      if (mixedRouteIsAllV3(route)) {
        return await addV3Swap(planner, trade, options, routerMustCustody, payerIsUser, performAggregatedSlippageCheck)
      } else if (mixedRouteIsAllV2(route)) {
        return addV2Swap(planner, trade, options, routerMustCustody, payerIsUser, performAggregatedSlippageCheck)
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
        const recipientAddress = isLastSectionInRoute(i)
          ? recipient
          : (sections[i + 1][0] as unknown as Pair).liquidityToken.address
          
        const inAmount = i === 0 ? amountIn : 0n
        const outAmount = !lastSectionInRoute ? 0n : amountOut
        if (mixedRouteIsAllV3(newRoute as BaseRoute)) {
          const pathStr = encodeMixedRouteToPath(newRoute, !isExactIn)

          planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
            // if not last section: send tokens directly to the first v2 pair of the next section
            // note: because of the partitioning function we can be sure that the next section is v2
            recipientAddress,
            inAmount, // amountIn
            outAmount, // amountOut
            pathStr, // path
            payerIsUser && i === 0, // payerIsUser
          ])
        } else if (mixedRouteIsAllV2(newRoute as BaseRoute)) {
          const path = newRoute.path.map((token) => token.wrapped.address)

          planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
            recipientAddress, // recipient
            inAmount, // amountIn
            outAmount, // amountOutMin
            path, // path
            payerIsUser && i === 0,
          ])
        } else {
          throw new Error('Unsupported route')
        }
      }
    }
  }
}
