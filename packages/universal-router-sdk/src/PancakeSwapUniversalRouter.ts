import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router'
import { MethodParameters } from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'
import { encodeFunctionData, toHex } from 'viem'
import { UniversalRouterABI } from './abis/UniversalRouter'
import { PancakeSwapTrade } from './entities/protocols/pancakeswap'
import { PancakeSwapOptions, SwapRouterConfig } from './entities/types'
import { RoutePlanner } from './utils/RoutePlanner'
import { encodePermit } from './utils/encodePermit'

export abstract class PancakeSwapUniversalRouter {
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapERC20CallParameters(
    planner: RoutePlanner,
    trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>,
    options: PancakeSwapOptions,
  ): MethodParameters {
    const tradeCommand: PancakeSwapTrade = new PancakeSwapTrade(trade, options)

    const inputCurrency = tradeCommand.trade.inputAmount.currency
    invariant(!(inputCurrency.isNative && !!options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit && typeof options.inputTokenPermit === 'object') {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? SmartRouter.maximumAmountIn(tradeCommand.trade, options.slippageTolerance, tradeCommand.trade.inputAmount)
          .quotient
      : 0n

    tradeCommand.encode(planner)
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
    const calldata = config.deadline
      ? encodeFunctionData({
          abi: UniversalRouterABI,
          args: [commands, inputs, BigInt(config.deadline)],
          functionName: 'execute',
        })
      : encodeFunctionData({ abi: UniversalRouterABI, args: [commands, inputs], functionName: 'execute' })
    return { calldata, value: toHex(nativeCurrencyValue) }
  }
}
