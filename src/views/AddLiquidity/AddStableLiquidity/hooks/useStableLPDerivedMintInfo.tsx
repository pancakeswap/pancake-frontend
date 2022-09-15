import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Price, Token } from '@pancakeswap/sdk'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { PairState } from 'hooks/usePairs'

import useTotalSupply from 'hooks/useTotalSupply'
import { useContext, useMemo } from 'react'

import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { Field } from 'state/mint/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { StableConfigContext } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useEstimatedAmount } from 'views/Swap/StableSwap/hooks/useStableTradeExactIn'
import useSWR from 'swr'
import { useMintState } from 'state/mint/hooks'

export interface StablePair {
  liquidityToken: Token | null
  tokenAmounts: any[]
  token0: Currency
  token1: Currency
  priceOf: (token: Currency) => CurrencyAmount<Currency> | Price<Currency, Currency> | Fraction
  token0Price: () => CurrencyAmount<Currency> | Price<Currency, Currency> | Fraction
  token1Price: () => CurrencyAmount<Currency> | Price<Currency, Currency> | Fraction
  // NOTE: Stable Tokens don't need this
  reserve1: CurrencyAmount<Currency>
  reserve0: CurrencyAmount<Currency>
  getLiquidityValue: () => CurrencyAmount<Currency>
}

interface UseStablePairResponse {
  pairState: PairState
  pair: StablePair
}

export function useStablePair(currencyA: Token, currencyB: Token): UseStablePairResponse {
  const { stableSwapConfig, stableSwapContract } = useContext(StableConfigContext)

  const currencyAAmountQuotient = tryParseAmount('1', currencyA)?.quotient

  const { data: estimatedToken1Amount } = useEstimatedAmount({
    estimatedCurrency: currencyB,
    quotient: currencyAAmountQuotient?.toString(),
    stableSwapContract,
    stableSwapConfig,
  })

  const pair = useMemo(() => {
    const isPriceValid = currencyAAmountQuotient && estimatedToken1Amount

    const ZERO_AMOUNT = CurrencyAmount.fromRawAmount(currencyB, '0')

    const token0Price = isPriceValid
      ? new Price(currencyA, currencyB, currencyAAmountQuotient, estimatedToken1Amount.quotient)
      : ZERO_AMOUNT

    return {
      liquidityToken: stableSwapConfig?.liquidityToken || null,
      tokenAmounts: [],
      token0: currencyA,
      token1: currencyB,
      priceOf: (token) =>
        isPriceValid ? (token?.address === currencyA?.address ? token0Price : token0Price.invert()) : ZERO_AMOUNT,
      token0Price: () => token0Price,
      token1Price: () => token0Price.invert(),
      // NOTE: Stable Tokens don't need this
      reserve1: ZERO_AMOUNT,
      reserve0: ZERO_AMOUNT,
      getLiquidityValue: () => ZERO_AMOUNT,
    }
  }, [stableSwapConfig?.liquidityToken, currencyA, currencyB, currencyAAmountQuotient, estimatedToken1Amount])

  if (!stableSwapConfig) {
    return { pairState: PairState.NOT_EXISTS, pair: undefined }
  }

  return { pairState: PairState.EXISTS, pair }
}

function useMintedStabelLP({
  stableSwapInfoContract,
  stableSwapConfig,
  stableSwapAddress,
  currencyInput,
  currencyInputAmount,
  currencyOutputAmount,
}) {
  const quotient0Str = currencyInputAmount?.toString()
  const quotient1Str = currencyOutputAmount?.toString()

  const isValid = !!stableSwapAddress && !!quotient0Str && !!quotient1Str

  return useSWR(
    isValid ? ['get_add_liquidity_mint_amount', stableSwapAddress, quotient0Str, quotient1Str] : null,
    async () => {
      const isToken0 = stableSwapConfig?.token0?.address === currencyInput?.address

      const amounts = isToken0 ? [quotient0Str, quotient1Str] : [quotient1Str, quotient0Str]

      return stableSwapInfoContract.get_add_liquidity_mint_amount(stableSwapAddress, amounts)
    },
  )
}

export function useStableLPDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: StablePair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  liquidityMinted?: CurrencyAmount<Token>
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
} {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )

  // pair
  const { pairState, pair } = useStablePair(currencyA?.wrapped, currencyB?.wrapped)

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.quotient, BIG_INT_ZERO))

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [currencyA, currencyB])
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
    typedValue,
    currencies[independentField],
  )

  const dependentAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
    otherTypedValue,
    currencies[dependentField],
  )

  const parsedAmounts: { [field in Field]: CurrencyAmount<Currency> | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const { stableSwapConfig, stableSwapContract, stableSwapInfoContract } = useContext(StableConfigContext)

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  const currencyAAmountQuotient = currencyAAmount?.quotient
  const currencyBAmountQuotient = currencyBAmount?.quotient

  const { data: estimatedOutputAmount } = useEstimatedAmount({
    estimatedCurrency: currencyAAmountQuotient ? currencyB : currencyA,
    quotient: currencyAAmountQuotient ? currencyAAmountQuotient?.toString() : currencyBAmountQuotient?.toString(),
    stableSwapConfig,
    stableSwapContract,
  })

  const price = useMemo(() => {
    const isEstimatedOutputAmountZero = estimatedOutputAmount?.equalTo(0)

    if ((currencyAAmountQuotient || currencyBAmountQuotient) && estimatedOutputAmount && !isEstimatedOutputAmountZero) {
      return currencyAAmountQuotient
        ? new Price(currencyA, currencyB, currencyAAmountQuotient, estimatedOutputAmount.quotient)
        : new Price(currencyA, currencyB, estimatedOutputAmount.quotient, currencyBAmountQuotient)
    }
    return undefined
  }, [estimatedOutputAmount, currencyA, currencyB, currencyBAmountQuotient, currencyAAmountQuotient])

  const { data: lpMinted } = useMintedStabelLP({
    stableSwapAddress: stableSwapConfig?.stableSwapAddress,
    stableSwapInfoContract,
    stableSwapConfig,
    currencyInput: currencyAAmountQuotient ? currencyA : currencyB,
    currencyInputAmount: currencyAAmountQuotient || currencyBAmountQuotient,
    currencyOutputAmount: currencyAAmountQuotient ? currencyBAmountQuotient : currencyAAmountQuotient,
  })

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    if (pair?.liquidityToken && totalSupply && lpMinted) {
      try {
        return CurrencyAmount.fromRawAmount(pair?.liquidityToken, lpMinted?.toString())
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
    return undefined
  }, [pair?.liquidityToken, totalSupply, lpMinted])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  let addError: string | undefined
  if (!account) {
    error = t('Connect Wallet')
  }

  if (pairState === PairState.INVALID) {
    error = error ?? t('Choose a valid pair')
  }

  if (
    currencyAAmount &&
    currencyBAmount &&
    currencyBalances?.[Field.CURRENCY_A]?.equalTo(0) &&
    currencyBalances?.[Field.CURRENCY_B]?.equalTo(0)
  ) {
    error = error ?? t('No token balance')
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    addError = t('Enter an amount')
  }

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol })
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol })
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  }
}
