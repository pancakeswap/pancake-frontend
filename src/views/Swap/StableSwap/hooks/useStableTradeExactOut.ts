import { CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'

import { StableTrade, useEstimatedAmount, useStableTradeResponse } from './useStableTradeExactIn'
import useStableConfig from './useStableConfig'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactOut(
  currencyIn?: Token,
  currencyAmountOut?: CurrencyAmount<Token>,
): StableTrade | null {
  const isParamInvalid = !currencyAmountOut || !currencyIn

  const { stableSwapContract, stableSwapConfig } = useStableConfig({
    tokenAAddress: currencyAmountOut?.currency?.address,
    tokenBAddress: currencyIn?.address,
  })

  const currencyAmountOutQuotient = currencyAmountOut?.quotient?.toString()

  const { data: currencyAmountIn } = useEstimatedAmount({
    currency: currencyIn,
    quotient: currencyAmountOutQuotient,
    stableSwapContract,
    stableSwapConfig,
    isParamInvalid,
  })

  return useStableTradeResponse({
    isParamInvalid,
    currencyAmountIn,
    currencyAmountOut,
    stableSwapConfig,
  })
}
