import { Currency, CurrencyAmount, Fraction, ONE, Price, TradeType } from '@pancakeswap/sdk'
import useSWR from 'swr'
import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'
import { StableTrade } from './useStableTradeExactIn'

function findStablePair() {
  const stableSwapPair = stableSwapConfigs[0]

  return stableSwapPair
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactIn(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
): StableTrade | null {
  const isInvalid = !currencyAmountOut || !currencyIn

  const stablePair = findStablePair()

  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)

  // Philip TODO: Bounce the request
  const { data: estimatedOutputAmount } = useSWR(
    isInvalid
      ? null
      : [
          'swapContract',
          stablePair?.stableSwapAddress,
          currencyAmountOut?.currency?.symbol,
          currencyAmountOut?.quotient?.toString(),
        ],
    async () => {
      // swicth index to get inputamount
      return stableSwapContract.get_dy(1, 0, currencyAmountOut?.quotient?.toString())
    },
    {
      dedupingInterval: 5000,
    },
  )

  if (isInvalid || !estimatedOutputAmount) return null

  if (!stablePair) return null

  const currencyAmountIn = CurrencyAmount.fromRawAmount(currencyIn, estimatedOutputAmount)

  const maximumAmountIn = (slippageTolerance) => {
    const slippageAdjustedAmountIn = new Fraction(ONE)
      .add(slippageTolerance)
      .multiply(currencyAmountIn.quotient).quotient
    return CurrencyAmount.fromRawAmount(currencyAmountIn.currency, slippageAdjustedAmountIn)
  }

  const minimumAmountOut = (slippageTolerance) => {
    const slippageAdjustedAmountOut = new Fraction(ONE)
      .add(slippageTolerance)
      .invert()
      .multiply(currencyAmountOut.quotient).quotient
    return CurrencyAmount.fromRawAmount(currencyAmountOut.currency, slippageAdjustedAmountOut)
  }

  return {
    tradeType: TradeType.EXACT_OUTPUT,
    inputAmount: currencyAmountIn,
    outputAmount: currencyAmountOut,
    executionPrice: new Price(
      currencyAmountIn.currency,
      currencyAmountOut.currency,
      currencyAmountIn.quotient,
      currencyAmountOut.quotient,
    ),
    priceImpact: null,
    maximumAmountIn,
    minimumAmountOut,
  }
}
