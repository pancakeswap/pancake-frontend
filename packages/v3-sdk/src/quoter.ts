import { Address, encodeFunctionData, Hex } from 'viem'
import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { quoterABI } from './abi/Quoter'
import { quoterV2ABI } from './abi/QuoterV2'
import { Route } from './entities'
import { encodeRouteToPath, MethodParameters, toHex } from './utils'
import { FeeAmount } from './constants'

/**
 * Optional arguments to send to the quoter.
 */
export interface QuoteOptions {
  /**
   * The optional price limit for the trade.
   */
  sqrtPriceLimitX96?: BigintIsh

  /**
   * The optional quoter interface to use
   */
  useQuoterV2?: boolean
}

interface BaseQuoteParams {
  fee: FeeAmount
  sqrtPriceLimitX96: bigint
  tokenIn: Address
  tokenOut: Address
}

/**
 * Represents the Pancake V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */
export abstract class SwapQuoter {
  public static V1ABI = quoterABI

  public static V2ABI = quoterV2ABI

  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  public static quoteCallParameters<TInput extends Currency, TOutput extends Currency>(
    route: Route<TInput, TOutput>,
    amount: CurrencyAmount<TInput | TOutput>,
    tradeType: TradeType,
    options: QuoteOptions = {}
  ): MethodParameters {
    const singleHop = route.pools.length === 1
    const quoteAmount = amount.quotient
    let calldata: Hex
    const swapAbi = options.useQuoterV2 ? this.V2ABI : this.V1ABI

    if (singleHop) {
      const baseQuoteParams: BaseQuoteParams = {
        tokenIn: route.tokenPath[0].address,
        tokenOut: route.tokenPath[1].address,
        fee: route.pools[0].fee,
        sqrtPriceLimitX96: BigInt(options?.sqrtPriceLimitX96 ?? 0),
      }

      const v2QuoteParams = {
        ...baseQuoteParams,
        ...(tradeType === TradeType.EXACT_INPUT ? { amountIn: quoteAmount } : { amount: quoteAmount }),
      }

      const v1QuoteParams = [
        baseQuoteParams.tokenIn,
        baseQuoteParams.tokenOut,
        baseQuoteParams.fee,
        quoteAmount,
        baseQuoteParams.sqrtPriceLimitX96,
      ] as const

      const tradeTypeFunctionName =
        tradeType === TradeType.EXACT_INPUT ? 'quoteExactInputSingle' : 'quoteExactOutputSingle'

      if (options.useQuoterV2) {
        calldata = encodeFunctionData({
          abi: this.V2ABI,
          functionName: tradeTypeFunctionName,
          // @ts-ignore // FIXME
          args: [v2QuoteParams],
        })
      } else {
        calldata = encodeFunctionData({
          abi: this.V1ABI,
          functionName: tradeTypeFunctionName,
          args: v1QuoteParams,
        })
      }
    } else {
      invariant(options?.sqrtPriceLimitX96 === undefined, 'MULTIHOP_PRICE_LIMIT')
      const path = encodeRouteToPath(route, tradeType === TradeType.EXACT_OUTPUT)
      const tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInput' : 'quoteExactOutput'
      calldata = encodeFunctionData({
        // @ts-ignore
        abi: swapAbi,
        functionName: tradeTypeFunctionName,
        args: [path, quoteAmount],
      })
    }

    return {
      calldata,
      value: toHex(0),
    }
  }
}
