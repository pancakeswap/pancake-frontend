import { AptosCoin, Currency, CurrencyAmount, JSBI, Pair, Percent, Token } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useCurrencyBalance } from 'hooks/Balances'
import useTotalSupply from 'hooks/useTotalSupply'
import { useMemo } from 'react'
import formatAmountDisplay from 'utils/formatAmountDisplay'
import { useBurnState } from '../state/remove'
import { Field } from '../type'

export default function useBurnLiquidityInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  pair?: Pair | null,
): {
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token | AptosCoin>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  formattedAmounts: {
    [Field.LIQUIDITY_PERCENT]: string
    [Field.LIQUIDITY]?: string
    [Field.CURRENCY_A]?: string
    [Field.CURRENCY_B]?: string
  }
  error?: string
  tokenToReceive?: string
  estimateZapOutAmount?: CurrencyAmount<Token>
} {
  const { independentField, typedValue } = useBurnState()

  const { t } = useTranslation()

  // balances
  const userLiquidity = useCurrencyBalance(pair?.liquidityToken.address)

  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]

  const tokens = useMemo(
    () => ({
      [Field.CURRENCY_A]: tokenA,
      [Field.CURRENCY_B]: tokenB,
      [Field.LIQUIDITY]: pair?.liquidityToken,
    }),
    [tokenA, tokenB, pair?.liquidityToken],
  )

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).quotient)
      : undefined

  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).quotient)
      : undefined

  const liquidityValues: { [Field.CURRENCY_A]?: CurrencyAmount<Token>; [Field.CURRENCY_B]?: CurrencyAmount<Token> } =
    useMemo(
      () => ({
        [Field.CURRENCY_A]: liquidityValueA,
        [Field.CURRENCY_B]: liquidityValueB,
      }),
      [liquidityValueA, liquidityValueB],
    )

  const pctToRemove: Percent = useMemo(() => {
    let percentToRemove = new Percent('0', '100')
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

    return percentToRemove
  }, [liquidityValues, tokens, pair?.liquidityToken, typedValue, independentField, userLiquidity])

  const liquidityToRemove =
    userLiquidity && pctToRemove && pctToRemove.greaterThan('0')
      ? CurrencyAmount.fromRawAmount(userLiquidity.currency, pctToRemove.multiply(userLiquidity.quotient).quotient)
      : undefined

  const amountA =
    tokenA && pctToRemove && pctToRemove.greaterThan('0') && liquidityValueA
      ? CurrencyAmount.fromRawAmount(tokenA, pctToRemove.multiply(liquidityValueA.quotient).quotient)
      : undefined

  const amountB =
    tokenB && pctToRemove && pctToRemove.greaterThan('0') && liquidityValueB
      ? CurrencyAmount.fromRawAmount(tokenB, pctToRemove.multiply(liquidityValueB.quotient).quotient)
      : undefined

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token | AptosCoin>
    [Field.CURRENCY_A]?: CurrencyAmount<Token>
    [Field.CURRENCY_B]?: CurrencyAmount<Token>
  } = useMemo(
    () => ({
      [Field.LIQUIDITY_PERCENT]: pctToRemove,
      [Field.LIQUIDITY]: liquidityToRemove,
      [Field.CURRENCY_A]: amountA,
      [Field.CURRENCY_B]: amountB,
    }),
    [pctToRemove, liquidityToRemove, amountA, amountB],
  )

  const formattedAmounts = useMemo(
    () => ({
      [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
        ? '0'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
      [Field.LIQUIDITY]:
        independentField === Field.LIQUIDITY ? typedValue : formatAmountDisplay(parsedAmounts[Field.LIQUIDITY]),
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A ? typedValue : formatAmountDisplay(parsedAmounts[Field.CURRENCY_A]),
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_B ? typedValue : formatAmountDisplay(parsedAmounts[Field.CURRENCY_B]),
    }),
    [parsedAmounts, typedValue, independentField],
  )

  let error: string | undefined

  if (!parsedAmounts[Field.LIQUIDITY]) {
    error = error ?? t('Enter an amount')
  }

  return { parsedAmounts, error, formattedAmounts }
}
