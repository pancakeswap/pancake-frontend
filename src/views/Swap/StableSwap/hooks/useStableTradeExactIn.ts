import { Currency, CurrencyAmount, Price, Percent, TradeType, Fraction, ONE } from '@pancakeswap/sdk'

import useSWR from 'swr'
import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'

function findStablePair() {
  const stableSwapPair = stableSwapConfigs[0]

  return stableSwapPair
}

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}

function useStableConfig(address = '') {
  const stablePair = findStablePair()
  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)

  return {
    stableSwapConfig: stablePair,
    stableSwapContract,
  }
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
): StableTrade | null {
  const isInvalid = !currencyAmountIn || !currencyOut

  const { stableSwapContract, stableSwapConfig } = useStableConfig()

  const { data: estimatedOutputAmount } = useSWR(
    isInvalid ? null : ['swapContract', stableSwapConfig?.stableSwapAddress, currencyAmountIn?.quotient?.toString()],
    async () => {
      return stableSwapContract.get_dy(0, 1, currencyAmountIn?.quotient?.toString())
    },
    {
      dedupingInterval: 5000,
    },
  )

  if (isInvalid || !estimatedOutputAmount) return null

  if (!stableSwapConfig) return null

  const currencyAmountOut = CurrencyAmount.fromRawAmount(currencyOut, estimatedOutputAmount)

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
    tradeType: TradeType.EXACT_INPUT,
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
