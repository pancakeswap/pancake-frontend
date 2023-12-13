import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { MethodParameters } from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'
import { encodeFunctionData, toHex, Hex } from 'viem'
import { PancakeSwapTrade } from './entities/protocols/pancakeswap'
import { encodePermit } from './utils/inputTokens'
import { RoutePlanner } from './utils/routerCommands'
import { PancakeSwapOptions, SwapRouterConfig } from './entities/types'
import { UniversalRouterABI } from './abis/UniversalRouter'

export abstract class PancakeSwapUniversalRouter {
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapERC20CallParameters(
    trades: SmartRouterTrade<TradeType>,
    options: PancakeSwapOptions,
  ): MethodParameters {
    // TODO: use permit if signature included in swapOptions
    const planner = new RoutePlanner()

    const trade: PancakeSwapTrade = new PancakeSwapTrade(trades, options)
    const tradesList = !Array.isArray(trade.trade) ? [trade.trade] : trade.trade
    const sampleTrade = tradesList[0]

    const inputCurrency = sampleTrade.inputAmount.currency
    invariant(!(inputCurrency.isNative && !!options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit && typeof options.inputTokenPermit === 'object') {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? SmartRouter.maximumAmountIn(sampleTrade, options.slippageTolerance, sampleTrade.inputAmount).quotient
      : 0n

    trade.encode(planner, { allowRevert: false })
    return PancakeSwapUniversalRouter.encodePlan(planner, nativeCurrencyValue, {
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
    config: SwapRouterConfig = {},
  ): MethodParameters {
    const { commands, inputs } = planner
    let calldata: Hex
    if (config.deadline) {
      calldata = encodeFunctionData({
        abi: UniversalRouterABI,
        args: [commands, inputs, BigInt(config.deadline)],
        functionName: 'execute',
      })
    } else {
      calldata = encodeFunctionData({ abi: UniversalRouterABI, args: [commands, inputs], functionName: 'execute' })
    }
    return { calldata, value: toHex(nativeCurrencyValue) }
  }
}
