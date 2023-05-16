import { Currency, CurrencyAmount, Pair, Percent, Token } from '@pancakeswap/sdk'
import { useCallback, useMemo } from 'react'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useV2Pair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'

import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useAtom, useAtomValue } from 'jotai'
import { burnReducerAtom } from 'state/burn/reducer'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useTokenBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

export function useBurnState() {
  return useAtomValue(burnReducerAtom)
}

export function useDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  removalCheckedA?: boolean,
  removalCheckedB?: boolean,
  zapMode?: boolean,
): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  error?: string
  tokenToReceive?: string
  estimateZapOutAmount?: CurrencyAmount<Token>
} {
  const { account, chainId } = useAccountActiveChain()

  const { independentField, typedValue } = useBurnState()

  const { t } = useTranslation()

  // pair + totalsupply
  const [, pair] = useV2Pair(currencyA, currencyB)

  // balances
  const relevantTokenBalances = useTokenBalances(
    account ?? undefined,
    useMemo(() => [pair?.liquidityToken], [pair?.liquidityToken]),
  )
  const userLiquidity: undefined | CurrencyAmount<Token> = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair && totalSupply && userLiquidity && tokenA && totalSupply.quotient >= userLiquidity.quotient
      ? CurrencyAmount.fromRawAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).quotient)
      : undefined

  const liquidityValueB =
    pair && totalSupply && userLiquidity && tokenB && totalSupply.quotient >= userLiquidity.quotient
      ? CurrencyAmount.fromRawAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).quotient)
      : undefined
  const liquidityValues: { [Field.CURRENCY_A]?: CurrencyAmount<Token>; [Field.CURRENCY_B]?: CurrencyAmount<Token> } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  }

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.quotient, userLiquidity.quotient)
      }
    }
  }
  // user specified a specific amount of token a or b
  else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(typedValue, tokens[independentField])
    const liquidityValue = liquidityValues[independentField]
    if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
      percentToRemove = new Percent(independentAmount.quotient, liquidityValue.quotient)
    }
  }

  const liquidityToRemove =
    userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
      ? CurrencyAmount.fromRawAmount(userLiquidity.currency, percentToRemove.multiply(userLiquidity.quotient).quotient)
      : undefined

  const tokenToReceive =
    removalCheckedA && removalCheckedB
      ? undefined
      : removalCheckedA
      ? tokens[Field.CURRENCY_A]?.address
      : tokens[Field.CURRENCY_B]?.address

  const amountA =
    tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
      ? CurrencyAmount.fromRawAmount(tokenA, percentToRemove.multiply(liquidityValueA.quotient).quotient)
      : undefined

  const amountB =
    tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
      ? CurrencyAmount.fromRawAmount(tokenB, percentToRemove.multiply(liquidityValueB.quotient).quotient)
      : undefined

  const tokenAmountToZap = removalCheckedA && removalCheckedB ? undefined : removalCheckedA ? amountB : amountA

  const estimateZapOutAmount = useMemo(() => {
    if (pair && tokenAmountToZap) {
      try {
        return pair.getOutputAmount(tokenAmountToZap)[0]
      } catch (error) {
        return undefined
      }
    }
    return undefined
  }, [pair, tokenAmountToZap])

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Token>
    [Field.CURRENCY_B]?: CurrencyAmount<Token>
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]: liquidityToRemove,
    [Field.CURRENCY_A]: !zapMode
      ? amountA
      : amountA && removalCheckedA && !removalCheckedB && estimateZapOutAmount && liquidityValueA
      ? CurrencyAmount.fromRawAmount(
          tokenA,
          percentToRemove.multiply(liquidityValueA.quotient).quotient + estimateZapOutAmount.quotient,
        )
      : !removalCheckedA
      ? undefined
      : amountA,
    [Field.CURRENCY_B]: !zapMode
      ? amountB
      : amountB && removalCheckedB && !removalCheckedA && estimateZapOutAmount && liquidityValueB
      ? CurrencyAmount.fromRawAmount(
          tokenB,
          percentToRemove.multiply(liquidityValueB.quotient).quotient + estimateZapOutAmount.quotient,
        )
      : !removalCheckedB
      ? undefined
      : amountB,
  }

  let error: string | undefined
  if (!account) {
    error = t('Connect Wallet')
  }

  if (
    !parsedAmounts[Field.LIQUIDITY] ||
    (removalCheckedA && !parsedAmounts[Field.CURRENCY_A]) ||
    (removalCheckedB && !parsedAmounts[Field.CURRENCY_B])
  ) {
    error = error ?? t('Enter an amount')
  }

  return { pair, parsedAmounts, error, tokenToReceive, estimateZapOutAmount }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const [, dispatch] = useAtom(burnReducerAtom)

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  return {
    onUserInput,
  }
}
