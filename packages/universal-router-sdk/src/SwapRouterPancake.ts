import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { MethodParameters } from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'
import { Hex, encodeFunctionData, toHex } from 'viem'
import abi from './abis/UniversalRouter.json'
import { PancakeSwapTrade } from './entities/protocols/pancakeswap'
import { encodePermit } from './utils/inputTokens'
import { RoutePlanner } from './utils/routerCommands'
import { PancakeSwapOptions, SwapRouterConfig } from './utils/types'

export abstract class PancakeUniSwapRouter {
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
      ? toHex(
          SmartRouter.maximumAmountIn(
            sampleTrade,
            options.slippageTolerance,
            sampleTrade.inputAmount
          ).quotient.toString()
        )
      : toHex('0')

    trade.encode(planner, { allowRevert: false })
    return PancakeUniSwapRouter.encodePlan(planner, nativeCurrencyValue as `0x${string}`, {
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
    nativeCurrencyValue: Hex,
    config: SwapRouterConfig = {}
  ): MethodParameters {
    const { commands, inputs } = planner
    // view encodeFunctionData doesnt take in signature only name. so not sure how to handle this, perhaps solft
    // fix is to force a deadline to be passed in SwapRouterConfig
    // const functionSignature = !!config.deadline ? 'execute(bytes,bytes[],uint256)' : 'execute(bytes,bytes[])'
    const parameters = config.deadline ? [commands, inputs, Number(config.deadline)] : [commands, inputs]
    const calldata = encodeFunctionData({ abi, args: parameters, functionName: 'execute' })
    return { calldata, value: nativeCurrencyValue }
  }
}
