import { Percent, TradeType } from '@pancakeswap/sdk'
import {
  encodeV4RouteToPath,
  isV4ClPool,
  RouteType,
  SmartRouter,
  SmartRouterTrade,
  StablePool,
  V4BinPool,
  V4ClPool,
} from '@pancakeswap/smart-router'
import {
  EncodedMultiSwapInParams,
  EncodedMultiSwapOutParams,
  EncodedMultiSwapParams,
  EncodedSingleSwapInParams,
  EncodedSingleSwapOutParams,
  EncodedSingleSwapParams,
} from '@pancakeswap/v4-sdk'
import { zeroAddress } from 'viem'
import { ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../constants'
import { CommandType, V4ActionType } from '../../router.types'
import { ABIParametersType } from '../../utils/createCommand'
import { currencyAddressV4 } from '../../utils/currencyAddressV4'
import { encodePoolKey } from '../../utils/encodePoolKey'
import { RoutePlanner } from '../../utils/RoutePlanner'
import { SwapSection } from '../types'

/* eslint-disable no-useless-constructor */
export class SwapCommandBuilder {
  private tradeType: TradeType

  constructor(private planner: RoutePlanner, private section: SwapSection) {
    this.tradeType = section.tradeType
  }

  private getRoute() {
    return this.section.route
  }

  private isSingleHop(): boolean {
    return this.section.route.pools.length === 1
  }

  private maxAmountIn() {
    return this.section.inAmount
  }

  private minAmountOut() {
    return this.section.outAmount
  }

  private addV4SingleSwapParams() {
    const planer = new RoutePlanner()
    const pool = this.getRoute().pools[0] as V4BinPool | V4ClPool
    const poolKey = encodePoolKey(pool)

    const baseParams: EncodedSingleSwapParams = {
      poolKey,
      zeroForOne: this.tradeType === TradeType.EXACT_INPUT,
      hookData: zeroAddress,
    }
    if (isV4ClPool(pool)) {
      baseParams.sqrtPriceLimitX96 = pool.sqrtRatioX96
    }

    if (this.tradeType === TradeType.EXACT_INPUT) {
      const params: EncodedSingleSwapInParams = {
        ...baseParams,
        amountIn: this.maxAmountIn(),
        amountOutMinimum: this.minAmountOut(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN_SINGLE, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
        currencyAddressV4(pool.currency0),
        currencyAddressV4(pool.currency1),
      ])
    } else {
      const params: EncodedSingleSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut(),
        amountInMaximum: this.maxAmountIn(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT_SINGLE, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
        currencyAddressV4(pool.currency1),
        currencyAddressV4(pool.currency0),
      ])
    }

    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  private addV4MultiSwapParams() {
    const planer = new RoutePlanner()
    const route = this.getRoute()
    const baseParams: EncodedMultiSwapParams = {
      currencyIn: currencyAddressV4(route.input),
      path: encodeV4RouteToPath(route, this.tradeType === TradeType.EXACT_OUTPUT),
    }
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const params: EncodedMultiSwapInParams = {
        ...baseParams,
        amountIn: this.maxAmountIn(),
        amountOutMinimum: this.minAmountOut(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [currencyAddressV4(route.input), currencyAddressV4(route.output)])
    } else {
      const params: EncodedMultiSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut(),
        amountInMaximum: this.maxAmountIn(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT, [params])
    }
    planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [currencyAddressV4(route.output), currencyAddressV4(route.input)])
    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  private addV4SwapCommand() {
    if (this.isSingleHop()) {
      this.addV4SingleSwapParams()
    } else {
      this.addV4MultiSwapParams()
    }
  }

  private wrapInput(): void {
    if (this.section.needsWrapInput) {
      this.planner.addCommand(CommandType.WRAP_ETH, [ROUTER_AS_RECIPIENT, this.section.inAmount])
    }
  }

  private unwrapOutput() {
    if (this.section.needsUnwrapOutput) {
      const { recipient, outAmount } = this.section
      this.planner.addCommand(CommandType.UNWRAP_WETH, [recipient, outAmount])
    }
  }

  private addV2SwapCommand(): void {
    const route = this.getRoute()
    const path = route.path.map((token) => token.wrapped.address)
    const { recipient, inAmount, outAmount, needsUnwrapOutput } = this.section
    const payerIsUser = !needsUnwrapOutput
    if (this.tradeType === TradeType.EXACT_INPUT) {
      this.planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [recipient, inAmount, outAmount, path, payerIsUser])
      return
    }
    this.planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [recipient, outAmount, inAmount, path, payerIsUser])
  }

  private addV3SwapCommand() {
    const { route, recipient, inAmount, outAmount, needsUnwrapOutput } = this.section
    const payerIsUser = !needsUnwrapOutput
    // we need to generaate v3 path as a hash string. we can still use encodeMixedRoute
    // as a v3 swap is essentially a for of mixedRoute
    const path = SmartRouter.encodeMixedRouteToPath(
      { ...route, input: route.input, output: route.output },
      this.tradeType === TradeType.EXACT_OUTPUT,
    )

    if (this.tradeType === TradeType.EXACT_INPUT) {
      const exactInputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_IN> = [
        recipient,
        inAmount,
        outAmount,
        path,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactInputSingleParams)
    } else {
      const exactOutputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_OUT> = [
        recipient,
        outAmount,
        inAmount,
        path,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, exactOutputSingleParams)
    }
  }

  private addStableSwap(): void {
    const { route, recipient, inAmount, outAmount, needsUnwrapOutput } = this.section
    const path = route.path.map((token) => token.wrapped.address)
    const flags = route.pools.map((p) => BigInt((p as StablePool).balances.length))
    const payerIsUser = !needsUnwrapOutput
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const exactInputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_IN> = [
        recipient,
        inAmount,
        outAmount,
        path,
        flags,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, exactInputParams)
    } else {
      const exactOutputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_OUT> = [
        recipient,
        outAmount,
        inAmount,
        path,
        flags,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.STABLE_SWAP_EXACT_OUT, exactOutputParams)
    }
  }

  public build() {
    // Check per section
    this.wrapInput()

    switch (this.section.type) {
      case RouteType.V2:
        this.addV2SwapCommand()
        break
      case RouteType.V3:
        this.addV3SwapCommand()
        break
      case RouteType.STABLE:
        this.addStableSwap()
        break
      case RouteType.V4CL:
      case RouteType.V4BIN:
        this.addV4SwapCommand()
        break
      default:
        throw new Error('Invalid route type')
    }
    // Check per section
    this.unwrapOutput()

    // Check per trade
    this.sweep()

    // Check per trade
    this.handleRefund()
  }

  private sweep() {
    if (this.section.isFinal && this.section.needsUnwrapOutput) {
      const recipient = this.section.optionRecipient ?? SENDER_AS_RECIPIENT
      this.planner.addCommand(CommandType.SWEEP, [
        this.section.route.output.wrapped.address,
        recipient,
        this.section.outAmount,
      ])
    }
  }

  private handleRefund(): void {
    const { trade, optionRecipient, isFinal } = this.section
    if (isFinal) {
      const inputIsNative = trade.inputAmount.currency.isNative
      const riskPartialFill = riskOfPartialFill(trade)
      if (inputIsNative && (this.tradeType === TradeType.EXACT_OUTPUT || riskPartialFill)) {
        // Refund any leftover ETH
        this.planner.addCommand(CommandType.UNWRAP_WETH, [optionRecipient ?? SENDER_AS_RECIPIENT, 0n])
      }
    }
  }
}

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(50, 100)

// if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
function riskOfPartialFill(trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>): boolean {
  return SmartRouter.getPriceImpact(trade).greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
}
