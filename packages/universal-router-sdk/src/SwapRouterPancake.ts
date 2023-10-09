import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { MethodParameters } from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'
import { encodeFunctionData } from 'viem'
import abi from './abis/UniversalRouter.json'
import { PancakeSwapTrade } from './entities/protocols/pancakeswap'
import { encodePermit } from './utils/inputTokens'
import { RoutePlanner } from './utils/routerCommands'
import { PancakeSwapOptions, SwapRouterConfig } from './utils/types'

export abstract class PancakeUniversalSwapRouter {
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapERC20CallParameters(
    trades: SmartRouterTrade<TradeType>,
    options: PancakeSwapOptions
  ): MethodParameters {
    // TODO: use permit if signature included in swapOptions
    const planner = new RoutePlanner()

    const trade: PancakeSwapTrade = new PancakeSwapTrade(trades, options)
    const tradess = !Array.isArray(trade.trade) ? [trade.trade] : trade.trade
    const sampleTrade = tradess[0]

    const inputCurrency = sampleTrade.inputAmount.currency
    invariant(!(inputCurrency.isNative && !!options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit && typeof options.inputTokenPermit === 'object') {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? SmartRouter.maximumAmountIn(sampleTrade, options.slippageTolerance, sampleTrade.inputAmount).quotient
      : 0n

    trade.encode(planner, { allowRevert: false })
    return PancakeUniversalSwapRouter.encodePlan(planner, nativeCurrencyValue, {
      deadline: options.deadlineOrPreviousBlockhash
        ? BigInt(options.deadlineOrPreviousBlockhash.toString())
        : undefined,
    })
  }

  /**
   * Encodes a planned route into a method name and parameters for the Router contract.
   * @param planner the planned route
   * @param nativeCurrencyValue the native currency value of the planned route
   * @param config the router config
   */
  private static encodePlan(
    planner: RoutePlanner,
    nativeCurrencyValue: bigint,
    config: SwapRouterConfig = {}
  ): MethodParameters {
    const { commands, inputs } = planner
    const parameters = config.deadline ? [commands, inputs, Number(config.deadline)] : [commands, inputs]
    const calldata = encodeFunctionData({ abi, args: parameters, functionName: 'execute' })
    return { calldata, value: nativeCurrencyValue }
  }
}
