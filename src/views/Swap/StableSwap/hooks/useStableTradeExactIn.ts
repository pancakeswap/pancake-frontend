import { CurrencyAmount, Price, Percent, TradeType, Fraction, ONE, Currency, JSBI } from '@pancakeswap/sdk'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useCallback, useMemo, useContext } from 'react'
import useSWR from 'swr'
import { StableConfigContext } from './useStableConfig'

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency> | JSBI
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency> | JSBI
}

export const maximumAmountInFactory = (currencyAmountIn, slippageTolerance) => {
  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(currencyAmountIn.quotient).quotient
  return CurrencyAmount.fromRawAmount(currencyAmountIn.currency, slippageAdjustedAmountIn)
}

export const minimumAmountOutFactory = (currencyAmountOut, slippageTolerance) => {
  const slippageAdjustedAmountOut = new Fraction(ONE)
    .add(slippageTolerance)
    .invert()
    .multiply(currencyAmountOut.quotient).quotient
  return CurrencyAmount.fromRawAmount(currencyAmountOut.currency, slippageAdjustedAmountOut)
}

export function useStableTradeResponse({ currencyAmountIn, currencyAmountOut, stableSwapConfig }) {
  const maximumAmountIn = useCallback(
    (slippageTolerance) =>
      currencyAmountIn ? maximumAmountInFactory(currencyAmountIn, slippageTolerance) : BIG_INT_ZERO,
    [currencyAmountIn],
  )

  const minimumAmountOut = useCallback(
    (slippageTolerance) =>
      currencyAmountOut ? minimumAmountOutFactory(currencyAmountOut, slippageTolerance) : BIG_INT_ZERO,
    [currencyAmountOut],
  )

  const isInvalid = !currencyAmountIn || !currencyAmountOut || !stableSwapConfig || !currencyAmountIn

  const executionPrice = useMemo(() => {
    if (isInvalid) return null

    return new Price(
      currencyAmountIn.currency,
      currencyAmountOut.currency,
      currencyAmountIn.quotient,
      currencyAmountOut.quotient,
    )
  }, [isInvalid, currencyAmountIn, currencyAmountOut])

  if (isInvalid) return null

  return {
    tradeType: TradeType.EXACT_INPUT,
    inputAmount: currencyAmountIn,
    outputAmount: currencyAmountOut,
    executionPrice,
    priceImpact: null,
    maximumAmountIn,
    minimumAmountOut,
  }
}

export function useEstimatedAmount({ currency, stableSwapConfig, quotient, stableSwapContract }) {
  return useSWR(
    currency && !!quotient ? ['swapContract', stableSwapConfig?.stableSwapAddress, quotient] : null,
    async () => {
      const isToken0 = stableSwapConfig?.token0?.address === currency?.address

      const args = isToken0 ? [1, 0, quotient] : [0, 1, quotient]

      const estimatedAmount = await stableSwapContract.get_dy(...args)

      return CurrencyAmount.fromRawAmount(currency, estimatedAmount)
    },
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
): StableTrade | null {
  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)

  const currencyAmountInQuotient = currencyAmountIn?.quotient?.toString()

  const { data: currencyAmountOut } = useEstimatedAmount({
    currency: currencyOut,
    quotient: currencyAmountInQuotient,
    stableSwapContract,
    stableSwapConfig,
  })

  return useStableTradeResponse({
    currencyAmountIn,
    currencyAmountOut,
    stableSwapConfig,
  })
}
