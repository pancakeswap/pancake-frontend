import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@pancakeswap/sdk'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'

import { useTranslation } from 'contexts/Localization'
import tryParseAmount from 'utils/tryParseAmount'
import { AppState, useAppDispatch } from '../index'
import { useTokenBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

export function useBurnState(): AppState['burn'] {
  return useSelector<AppState, AppState['burn']>((state) => state.burn)
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
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  error?: string
  tokenToReceive?: string
  estimateZapOutAmount?: TokenAmount
} {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue } = useBurnState()

  const { t } = useTranslation()

  // pair + totalsupply
  const [, pair] = usePair(currencyA, currencyB)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
      : undefined

  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
      : undefined
  const liquidityValues: { [Field.CURRENCY_A]?: TokenAmount; [Field.CURRENCY_B]?: TokenAmount } = {
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
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw)
      }
    }
  }
  // user specified a specific amount of token a or b
  else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(typedValue, tokens[independentField])
    const liquidityValue = liquidityValues[independentField]
    if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
      percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw)
    }
  }

  const liquidityToRemove =
    userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
      ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
      : undefined

  const tokenToReceive =
    removalCheckedA && removalCheckedB
      ? undefined
      : removalCheckedA
      ? tokens[Field.CURRENCY_A]?.address
      : tokens[Field.CURRENCY_B]?.address

  const amountA =
    tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
      ? new TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
      : undefined

  const amountB =
    tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
      ? new TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
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
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]: liquidityToRemove,
    [Field.CURRENCY_A]: !zapMode
      ? amountA
      : amountA && removalCheckedA && !removalCheckedB && estimateZapOutAmount
      ? new TokenAmount(
          tokenA,
          JSBI.add(percentToRemove.multiply(liquidityValueA.raw).quotient, estimateZapOutAmount.raw),
        )
      : !removalCheckedA
      ? undefined
      : amountA,
    [Field.CURRENCY_B]: !zapMode
      ? amountB
      : amountB && removalCheckedB && !removalCheckedA && estimateZapOutAmount
      ? new TokenAmount(
          tokenB,
          JSBI.add(percentToRemove.multiply(liquidityValueB.raw).quotient, estimateZapOutAmount.raw),
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
  const dispatch = useAppDispatch()

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
