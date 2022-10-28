import { Percent, TradeType } from '@pancakeswap/swap-sdk-core'
import {
  routerSwapExactInput,
  routerAddLiquidity,
  routerRemoveLiquidity,
  routerSwapExactInputDoublehop,
  routerSwapExactInputTriplehop,
  routerSwapExactOutput,
  routerSwapExactOutputDoublehop,
  routerSwapExactOutputTriplehop,
} from './generated/swap'
import { Trade } from './trade'
import { Currency } from './currency'

export interface TradeOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
}

export abstract class Router {
  public static swapCallParameters(trade: Trade<Currency, Currency, TradeType>, options: TradeOptions) {
    const amountIn = trade.maximumAmountIn(options.allowedSlippage).quotient.toString()
    const amountOut = trade.minimumAmountOut(options.allowedSlippage).quotient.toString()

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      const args: [string, string] = [amountIn, amountOut]
      switch (trade.route.path.length) {
        case 2:
          return routerSwapExactInput(args, [trade.route.input.wrapped.address, trade.route.output.wrapped.address])
        case 3:
          return routerSwapExactInputDoublehop(args, [
            trade.route.path[0].address,
            trade.route.path[1].address,
            trade.route.path[2].address,
          ])
        case 4:
          return routerSwapExactInputTriplehop(args, [
            trade.route.path[0].address,
            trade.route.path[1].address,
            trade.route.path[2].address,
            trade.route.path[3].address,
          ])
        default:
          return undefined
      }
    } else if (trade.tradeType === TradeType.EXACT_OUTPUT) {
      const args: [string, string] = [amountOut, amountIn]
      switch (trade.route.path.length) {
        case 2:
          return routerSwapExactOutput(args, [trade.route.input.wrapped.address, trade.route.output.wrapped.address])
        case 3:
          return routerSwapExactOutputDoublehop(args, [
            trade.route.path[0].address,
            trade.route.path[1].address,
            trade.route.path[2].address,
          ])
        case 4:
          return routerSwapExactOutputTriplehop(args, [
            trade.route.path[0].address,
            trade.route.path[1].address,
            trade.route.path[2].address,
            trade.route.path[3].address,
          ])
        default:
          return undefined
      }
    }

    return undefined
  }

  public static addLiquidityParameters(
    amountX: string,
    amountY: string,
    amountXMin: string,
    amountYMin: string,
    addressX: string,
    addressY: string
  ) {
    return routerAddLiquidity([amountX, amountY, amountXMin, amountYMin], [addressX, addressY])
  }

  public static removeLiquidityParameters(
    liquidityAmount: string,
    minAmountX: string,
    minAmountY: string,
    addressX: string,
    addressY: string
  ) {
    return routerRemoveLiquidity([liquidityAmount, minAmountX, minAmountY], [addressX, addressY])
  }
}
