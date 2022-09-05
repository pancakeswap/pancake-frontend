import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useContext } from 'react'
import { StableTrade, useEstimatedAmount, useStableTradeResponse } from './useStableTradeExactIn'
import { StableConfigContext } from './useStableConfig'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactOut(
  currencyIn?: Token,
  currencyAmountOut?: CurrencyAmount<Token>,
): StableTrade | null {
  const isParamInvalid = !currencyAmountOut || !currencyIn

  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)

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
