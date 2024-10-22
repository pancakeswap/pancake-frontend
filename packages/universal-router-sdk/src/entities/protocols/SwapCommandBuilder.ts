import { TradeType } from '@pancakeswap/sdk'
import { BaseRoute, V4BinPool, V4ClPool } from '@pancakeswap/smart-router'
import { encodeV4RouteToPath, isV4ClPool } from '@pancakeswap/smart-router/dist/evm/v3-router/utils'
import {
  EncodedMultiSwapInParams,
  EncodedMultiSwapOutParams,
  EncodedMultiSwapParams,
  EncodedSingleSwapInParams,
  EncodedSingleSwapOutParams,
  EncodedSingleSwapParams,
} from '@pancakeswap/v4-sdk'
import { zeroAddress } from 'viem'
import { CommandType, V4ActionType } from '../../router.types'
import { currencyAddressV4 } from '../../utils/currencyAddressV4'
import { encodePoolKey } from '../../utils/encodePoolKey'
import { RoutePlanner } from '../../utils/RoutePlanner'

/* eslint-disable no-useless-constructor */
export class SwapCommandBuilder {
  constructor(
    private planner: RoutePlanner,
    private tradeType: TradeType,
    private route: BaseRoute,
    private maxAmountIn: bigint,
    private minAmountOut: bigint,
  ) {}

  public getRoute() {
    return this.route
  }

  public isSingleHop(): boolean {
    return this.getRoute().path.length === 2
  }

  private addSingleSwapParams() {
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
        amountIn: this.maxAmountIn,
        amountOutMinimum: this.minAmountOut,
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN_SINGLE, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
        currencyAddressV4(pool.currency0),
        currencyAddressV4(pool.currency1),
      ])
    } else {
      const params: EncodedSingleSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut,
        amountInMaximum: this.maxAmountIn,
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT_SINGLE, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
        currencyAddressV4(pool.currency1),
        currencyAddressV4(pool.currency0),
      ])
    }

    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  private addMultiSwapParams() {
    const planer = new RoutePlanner()
    const baseParams: EncodedMultiSwapParams = {
      currencyIn: currencyAddressV4(this.route.input),
      path: encodeV4RouteToPath(this.route, this.tradeType === TradeType.EXACT_OUTPUT),
    }
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const params: EncodedMultiSwapInParams = {
        ...baseParams,
        amountIn: this.maxAmountIn,
        amountOutMinimum: this.minAmountOut,
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN, [params])
      planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
        currencyAddressV4(this.route.input),
        currencyAddressV4(this.route.output),
      ])
    } else {
      const params: EncodedMultiSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut,
        amountInMaximum: this.maxAmountIn,
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT, [params])
    }
    planer.addAction(V4ActionType.SETTLE_TAKE_PAIR, [
      currencyAddressV4(this.route.output),
      currencyAddressV4(this.route.input),
    ])
    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  public buildCommand() {
    if (this.isSingleHop()) {
      this.addSingleSwapParams()
    } else {
      this.addMultiSwapParams()
    }
  }
}
