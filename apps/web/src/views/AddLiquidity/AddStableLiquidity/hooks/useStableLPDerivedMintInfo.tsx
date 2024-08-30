import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, ERC20Token, Fraction, Percent, Price, Token } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useAccount } from 'wagmi'

import { BIG_INT_ZERO } from 'config/constants/exchange'
import { PairState } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { useContext, useMemo } from 'react'
import { CurrencyField as Field } from 'utils/types'
import { useAddLiquidityV2FormState } from 'state/mint/reducer'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Address } from 'viem'
import { useEstimatedAmount } from 'views/Swap/hooks/useEstimatedAmount'
import { StableConfigContext, UseStableSwapInfoContract } from 'views/Swap/hooks/useStableConfig'

export interface StablePair {
  liquidityToken: ERC20Token | undefined
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
  pair?: StablePair
}

export function useStablePair(currencyA?: Currency, currencyB?: Currency): UseStablePairResponse {
  const stableConfigContext = useContext(StableConfigContext)

  const [token0, token1] =
    currencyA && currencyB && currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA?.wrapped, currencyB?.wrapped]
      : [currencyB?.wrapped, currencyA?.wrapped]

  const token0AmountQuotient = tryParseAmount('1', token0)?.quotient

  const { data: estimatedToken1Amount } = useEstimatedAmount({
    estimatedCurrency: token1,
    quotient: token0AmountQuotient?.toString(),
    stableSwapContract: stableConfigContext?.stableSwapContract,
    stableSwapConfig: stableConfigContext?.stableSwapConfig,
  })

  const pair = useMemo<StablePair | undefined>(() => {
    if (!token0 || !token1 || !currencyB) {
      return undefined
    }
    const isPriceValid = token0AmountQuotient && estimatedToken1Amount

    const ZERO_AMOUNT = CurrencyAmount.fromRawAmount(currencyB, '0')

    const token0Price = isPriceValid
      ? new Price(token0, token1, token0AmountQuotient, estimatedToken1Amount.quotient)
      : ZERO_AMOUNT

    return {
      liquidityToken: stableConfigContext?.stableSwapConfig?.liquidityToken,
      tokenAmounts: [],
      token0,
      token1,
      priceOf: (token) => (isPriceValid ? (token?.equals(token0) ? token0Price : token0Price.invert()) : ZERO_AMOUNT),
      token0Price: () => token0Price,
      token1Price: () => token0Price.invert(),
      // NOTE: Stable Tokens don't need this
      reserve1: ZERO_AMOUNT,
      reserve0: ZERO_AMOUNT,
      getLiquidityValue: () => ZERO_AMOUNT,
    }
  }, [
    token0,
    token1,
    currencyB,
    token0AmountQuotient,
    estimatedToken1Amount,
    stableConfigContext?.stableSwapConfig?.liquidityToken,
  ])

  if (!stableConfigContext?.stableSwapConfig) {
    return { pairState: PairState.NOT_EXISTS, pair: undefined }
  }

  return { pairState: PairState.EXISTS, pair }
}

function useMintedStableLP({
  stableSwapInfoContract,
  stableSwapConfig,
  stableSwapAddress,
  currencyInput,
  currencyInputAmount,
  currencyOutputAmount,
}: {
  stableSwapInfoContract?: UseStableSwapInfoContract
  stableSwapConfig: any
  stableSwapAddress?: Address
  currencyInput: Currency | undefined
  currencyInputAmount: bigint | undefined
  currencyOutputAmount: bigint | undefined
}) {
  const quotient0 = currencyInputAmount || 0n
  const quotient1 = currencyOutputAmount || 0n

  const isToken0 =
    currencyInput && stableSwapConfig?.token0 ? currencyInput?.wrapped?.equals(stableSwapConfig?.token0) : false
  const amounts = useMemo(() => {
    return isToken0 ? ([quotient0, quotient1] as const) : ([quotient1, quotient0] as const)
  }, [isToken0, quotient0, quotient1])

  const inputs = useMemo(() => {
    return [stableSwapAddress as Address, amounts] as const
  }, [stableSwapAddress, amounts])

  const { result, error, loading, syncing } = useSingleCallResult({
    contract: stableSwapInfoContract,
    functionName: 'get_add_liquidity_mint_amount',
    args: inputs,
  })

  // TODO: Combine get_add_liquidity_mint_amount + balances in one call
  const balanceResult = useSingleCallResult({
    contract: stableSwapInfoContract,
    functionName: 'balances',
    args: useMemo(() => [stableSwapAddress as Address] as const, [stableSwapAddress]),
  })

  return useMemo(
    () => ({
      reserves: balanceResult?.result || [0n, 0n],
      data: result,
      loading: loading || syncing,
      error,
    }),
    [balanceResult?.result, result, loading, syncing, error],
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
  loading?: boolean
  liquidityMinted?: CurrencyAmount<Token>
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
  reserves: readonly [bigint, bigint]
} {
  const { address: account } = useAccount()

  const { t } = useTranslation()

  const { independentField, typedValue, otherTypedValue } = useAddLiquidityV2FormState()

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
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && totalSupply.quotient === BIG_INT_ZERO)

  // balances
  const balances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [currencyA, currencyB], [currencyA, currencyB]),
  )
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  // amounts
  const independentCurrency = currencies[independentField]
  const independentAmount: CurrencyAmount<Currency> | undefined =
    (independentCurrency && tryParseAmount(typedValue, independentCurrency)) ||
    (independentCurrency && CurrencyAmount.fromRawAmount(independentCurrency, '0')) ||
    undefined

  const dependentCurrency = currencies[dependentField]
  const dependentAmount: CurrencyAmount<Currency> | undefined =
    tryParseAmount(otherTypedValue, dependentCurrency) ||
    (dependentCurrency ? CurrencyAmount.fromRawAmount(dependentCurrency, '0') : undefined)

  const parsedAmounts: { [field in Field]: CurrencyAmount<Currency> | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const stableConfigContext = useContext(StableConfigContext)

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  const currencyAAmountQuotient = currencyAAmount?.quotient
  const targetCurrency = currencyAAmountQuotient ? currencyA : currencyB
  const targetAmount = tryParseAmount('1', targetCurrency)
  const currencyBAmountQuotient = currencyBAmount?.quotient

  const { data: estimatedOutputAmount } = useEstimatedAmount({
    estimatedCurrency: currencyAAmountQuotient ? currencyB : currencyA,
    quotient: targetAmount?.quotient?.toString(),
    stableSwapConfig: stableConfigContext?.stableSwapConfig,
    stableSwapContract: stableConfigContext?.stableSwapContract,
  })

  const price = useMemo(() => {
    const isEstimatedOutputAmountZero = estimatedOutputAmount?.equalTo(0)

    if (
      currencyA &&
      currencyB &&
      (currencyAAmountQuotient || currencyBAmountQuotient) &&
      targetAmount &&
      estimatedOutputAmount &&
      !isEstimatedOutputAmountZero
    ) {
      return currencyAAmountQuotient
        ? new Price(currencyA, currencyB, targetAmount.quotient, estimatedOutputAmount.quotient)
        : new Price(currencyB, currencyA, estimatedOutputAmount.quotient, targetAmount.quotient)
    }
    return undefined
  }, [targetAmount, estimatedOutputAmount, currencyA, currencyB, currencyBAmountQuotient, currencyAAmountQuotient])

  const {
    reserves,
    data: lpMinted,
    error: estimateLPError,
    loading,
  } = useMintedStableLP({
    stableSwapAddress: stableConfigContext?.stableSwapConfig?.stableSwapAddress,
    stableSwapInfoContract: stableConfigContext?.stableSwapInfoContract,
    stableSwapConfig: stableConfigContext?.stableSwapConfig,
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

  const oneCurrencyRequired =
    !parsedAmounts[Field.CURRENCY_A]?.greaterThan(0) && !parsedAmounts[Field.CURRENCY_B]?.greaterThan(0)
  const twoCurrenciesRequired =
    !parsedAmounts[Field.CURRENCY_A]?.greaterThan(0) || !parsedAmounts[Field.CURRENCY_B]?.greaterThan(0)

  if (noLiquidity ? twoCurrenciesRequired : oneCurrencyRequired) {
    addError = t('Enter an amount')
  }

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol })
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol })
  }

  if (estimateLPError) {
    addError = t('Unable to supply')
  }

  return {
    dependentField,
    loading,
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
    reserves,
  }
}
