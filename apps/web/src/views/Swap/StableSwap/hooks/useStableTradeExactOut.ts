import { CurrencyAmount, Currency, TradeType } from '@pancakeswap/sdk'
import { useContext } from 'react'
import { StableTrade, useEstimatedAmount, useStableTradeResponse } from './useStableTradeExactIn'
import { StableConfigContext } from './useStableConfig'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
): StableTrade | null {
  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)

  const currencyAmountOutQuotient = currencyAmountOut?.quotient?.toString()

  const { data: currencyAmountIn } = useEstimatedAmount({
    estimatedCurrency: currencyIn,
    quotient: currencyAmountOutQuotient,
    stableSwapContract,
    stableSwapConfig,
  })

  return useStableTradeResponse({
    currencyAmountIn,
    currencyAmountOut,
    stableSwapConfig,
    tradeType: TradeType.EXACT_OUTPUT,
  })
}
