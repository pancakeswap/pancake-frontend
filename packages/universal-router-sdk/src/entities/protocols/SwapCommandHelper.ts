import { Currency, TradeType } from '@pancakeswap/sdk'
import { PoolType, SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router'
import invariant from 'tiny-invariant'
import { zeroAddress } from 'viem'
import { RoutePlanner } from '../../utils/RoutePlanner'
import { BinSwapExactInputSingleParams } from '../../v4types'
import { PancakeSwapOptions } from '../types'

export class SwapCommandHelper {
  constructor(
    private planner: RoutePlanner,
    private trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>,
    private options: PancakeSwapOptions,
    private routerMustCustody: boolean,
    private payerIsUser: boolean,
  ) {
    invariant(trade.routes.length === 1, 'Only allow single route trade')
  }

  public getRoute() {
    return this.trade.routes[0]
  }

  public isSingleHop(): boolean {
    return this.getRoute().path.length === 2
  }

  public tradeType() {
    return this.trade.tradeType
  }

  public amountIn() {
    const { inputAmount } = this.getRoute()
    return SmartRouter.maximumAmountIn(this.trade, this.options.slippageTolerance, inputAmount).quotient
  }

  public minAmountOut() {
    const { outputAmount } = this.getRoute()
    return SmartRouter.minimumAmountOut(this.trade, this.options.slippageTolerance, outputAmount).quotient
  }

  public update() {
    const planer = new RoutePlanner()
    if (this.isSingleHop()) {
      const pool = this.getRoute().pools[0]
      switch (pool.type) {
        case PoolType.V4BIN: {
          const signBinSwapParameters: BinSwapExactInputSingleParams = {
            poolKey: {
              currency0: currencyAddressV4(pool.currency0),
              currency1: currencyAddressV4(pool.currency1),
              hooks: pool.hooks || zeroAddress,
              poolManager: pool.poolManager,
              fee: pool.fee,
              parameters: zeroAddress,
            },
            swapForY: true,
            amountIn: this.amountIn(),
            amountOutMinimum: this.minAmountOut(),
            hookData: zeroAddress,
          }

          // planer.addAction(V4ActionType.BIN_SWAP_EXACT_IN_SINGLE)
          break
        }
        case PoolType.V4CL:
          break
        default:
      }
    }
  }
}

function currencyAddressV4(currency: Currency) {
  return currency.isNative ? '0x0' : currency.wrapped.address
}

export enum V4SwapCases {
  EXACT_INPUT_SINGLE_CL,
  EXACT_INPUT_SINGLE_BIN,
}

export type V4SwapCaseHandler = Record<V4SwapCases, () => void>
