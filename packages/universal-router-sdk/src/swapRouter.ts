import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Currency, TradeType } from '@uniswap/sdk-core'
import { MethodParameters } from '@uniswap/v3-sdk'
import { BigNumber, BigNumberish } from 'ethers'
import { encodeFunctionData } from 'viem'
import abi from '../abis/UniversalRouterABI.json'
import { Command, RouterTradeType } from './entities/Command'
import { SwapOptions, UniswapTrade } from './entities/protocols/pancakeswap'
import { UnwrapWETH } from './entities/protocols/unwrapWETH'
import { ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from './utils/constants'
import { encodePermit } from './utils/inputTokens'
import { CommandType, RoutePlanner } from './utils/routerCommands'

export type SwapRouterConfig = {
  sender?: string // address
  deadline?: BigNumberish
}

export abstract class SwapRouter {

  public static swapCallParameters(trades: Command[] | Command, config: SwapRouterConfig = {}): MethodParameters {
    // eslint-disable-next-line no-param-reassign
    if (!Array.isArray(trades)) trades = [trades]

    const planner = new RoutePlanner()

    // track value flow to require the right amount of native value
    let currentNativeValueInRouter = BigNumber.from(0)
    let transactionValue = BigNumber.from(0)

    // tracks the input tokens (and ETH) used to buy NFTs to allow us to sweep
    const nftInputTokens = new Set<string>()

    for (const trade of trades) {

      if (trade.tradeType === RouterTradeType.UniswapTrade) {
        const uniswapTrade = trade as UniswapTrade
        const inputIsNative = uniswapTrade.trade.inputAmount.currency.isNative
        const outputIsNative = uniswapTrade.trade.outputAmount.currency.isNative
        const swapOptions = uniswapTrade.options

        // invariant(!(inputIsNative && swapOptions.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

        if (swapOptions.inputTokenPermit) {
          encodePermit(planner, swapOptions.inputTokenPermit)
        }

        if (inputIsNative) {
          transactionValue = transactionValue.add(
            BigNumber.from(uniswapTrade.trade.maximumAmountIn(swapOptions.slippageTolerance).quotient.toString())
          )
        }
        // track amount of native currency in the router
        if (outputIsNative && swapOptions.recipient === ROUTER_AS_RECIPIENT) {
          currentNativeValueInRouter = currentNativeValueInRouter.add(
            BigNumber.from(uniswapTrade.trade.minimumAmountOut(swapOptions.slippageTolerance).quotient.toString())
          )
        }
        uniswapTrade.encode(planner, { allowRevert: false })
        /**
         * is UnwrapWETH
         */
      } else if (trade.tradeType === RouterTradeType.UnwrapWETH) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const UnwrapWETH = trade as UnwrapWETH
        trade.encode(planner, { allowRevert: false })
        currentNativeValueInRouter = currentNativeValueInRouter.add(UnwrapWETH.amount)
        /**
         * else
         */
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'trade must be of instance: UniswapTrade or NFTTrade'
      }
    }

    // TODO: matches current logic for now, but should eventually only sweep for multiple NFT trades
    // or NFT trades with potential slippage (i.e. sudo).
    // Note: NFTXV2 sends excess ETH to the caller (router), not the specified recipient
    nftInputTokens.forEach((inputToken) => {
      planner.addCommand(CommandType.SWEEP, [inputToken, SENDER_AS_RECIPIENT, 0])
    })
    return SwapRouter.encodePlan(planner, transactionValue, config)
  }

  /**
   * @deprecated in favor of swapCallParameters. Update before next major version 2.0.0
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapERC20CallParameters(
    trades: RouterTrade<Currency, Currency, TradeType>,
    options: SwapOptions
  ): MethodParameters {
    // TODO: use permit if signature included in swapOptions
    const planner = new RoutePlanner()

    const trade: UniswapTrade = new UniswapTrade(trades, options)

    const inputCurrency = trade.trade.inputAmount.currency
    // invariant(!(inputCurrency.isNative && options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit) {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? BigNumber.from(trade.trade.maximumAmountIn(options.slippageTolerance).quotient.toString())
      : BigNumber.from(0)

    trade.encode(planner, { allowRevert: false })
    return SwapRouter.encodePlan(planner, nativeCurrencyValue, {
      deadline: options.deadlineOrPreviousBlockhash ? BigNumber.from(options.deadlineOrPreviousBlockhash) : undefined,
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
    nativeCurrencyValue: BigNumber,
    config: SwapRouterConfig = {}
  ): MethodParameters {
    const { commands, inputs } = planner
    const functionSignature = config.deadline ? 'execute(bytes,bytes[],uint256)' : 'execute(bytes,bytes[])'
    const parameters = config.deadline ? [commands, inputs, config.deadline] : [commands, inputs]
    const calldata = encodeFunctionData({ abi, functionName: functionSignature, args: parameters })
    return { calldata, value: nativeCurrencyValue.toHexString() }
  }
}
