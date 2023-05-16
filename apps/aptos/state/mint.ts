import { Currency, CurrencyAmount, Pair, Percent, Price } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useCurrencyBalance } from 'hooks/Balances'
import { PairState, usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { useAtom, useAtomValue } from 'jotai'
import { atomWithReducer } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

export enum Field {
  CURRENCY_A = 'currencyA',
  CURRENCY_B = 'currencyB',
}

const typeInput = createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>('mint/typeInputMint')
const resetMintState = createAction<void>('mint/resetMintState')

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
}

const reducer = createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value

        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        }
      }
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      }
    }),
)

const mintReducerAtom = atomWithReducer(initialState, reducer)

export function useMintState() {
  return useAtomValue(mintReducerAtom)
}

export function useMintActionHandlers(noLiquidity?: boolean) {
  const [, dispatch] = useAtom(mintReducerAtom)

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  return {
    onFieldAInput,
    onFieldBInput,
  }
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  liquidityMinted?: CurrencyAmount<Currency>
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
} {
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
  const [pairState, pair] = usePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && totalSupply.quotient === BIG_INT_ZERO) ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        pair.reserve0.quotient === BIG_INT_ZERO &&
        pair.reserve1.quotient === BIG_INT_ZERO,
    )

  // balances
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_A]: useCurrencyBalance(currencies[Field.CURRENCY_A]?.wrapped.address),
    [Field.CURRENCY_B]: useCurrencyBalance(currencies[Field.CURRENCY_B]?.wrapped.address),
  }

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

  let error: string | undefined
  let addError: string | undefined

  if (pairState === PairState.INVALID) {
    error = error ?? t('Choose a valid pair')
  }

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

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
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown' })
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown' })
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
