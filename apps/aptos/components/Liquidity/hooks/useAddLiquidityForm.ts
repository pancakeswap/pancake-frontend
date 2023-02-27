import { Currency, CurrencyAmount, Percent, Price } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'

import { useContext, useMemo } from 'react'
import { useLiquidityStateOnly } from '../state/add'
import { Field } from '../type'
import { CurrencySelectorContext } from './useCurrencySelectRoute'
import { MintPairContext } from './useMintPair'

export function useDerivedMintInfo({
  totalSupply,
  noLiquidity,
}: {
  totalSupply: CurrencyAmount<Currency> | undefined
  noLiquidity: boolean
}): {
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  price?: Price<Currency, Currency>
  liquidityMinted?: CurrencyAmount<Currency>
  poolTokenPercentage?: Percent
  addError?: string
} {
  const { currencyBalances, pair } = useContext(MintPairContext)

  const { currencyA, currencyB } = useContext(CurrencySelectorContext)

  const { t } = useTranslation()

  const { independentField, typedValue, otherTypedValue } = useLiquidityStateOnly()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
    typedValue,
    currencies[independentField],
  )
  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = independentAmount?.wrapped
      const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency?.isNative
          ? CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient)
          : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, currencyB, pair])

  // @ts-ignore TODO: fix types
  const parsedAmounts: { [field in Field]: CurrencyAmount<Currency> | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
      if (currencyAAmount && currencyBAmount) {
        return new Price(
          currencyAAmount.currency,
          currencyBAmount.currency,
          currencyAAmount.quotient,
          currencyBAmount.quotient,
        )
      }
      return undefined
    }
    const wrappedCurrencyA = currencyA?.wrapped
    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
  }, [currencyA, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped]

    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
    return undefined
  }, [parsedAmounts, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let addError: string | undefined

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    addError = t('Enter an amount')
  }

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown' })
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown' })
  }

  return {
    parsedAmounts,
    price,
    liquidityMinted,
    poolTokenPercentage,
    addError,
  }
}
