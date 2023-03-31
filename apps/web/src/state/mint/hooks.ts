import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useTranslation } from '@pancakeswap/localization'
import {
  computePriceImpact,
  Currency,
  CurrencyAmount,
  JSBI,
  MINIMUM_LIQUIDITY,
  Pair,
  Percent,
  Price,
  Token,
} from '@pancakeswap/sdk'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { FetchStatus } from 'config/constants/types'
import { useTradeExactIn } from 'hooks/Trades'
import { useZapContract } from 'hooks/useContract'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { PairState, usePair } from 'hooks/usePairs'
import { usePreviousValue } from '@pancakeswap/hooks'
import { useSWRContract } from 'hooks/useSWRContract'
import useTotalSupply from 'hooks/useTotalSupply'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGasPrice } from 'state/user/hooks'
import { warningSeverity } from 'utils/exchange'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useAccount } from 'wagmi'
import { AppState, useAppDispatch } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>((state) => state.mint)
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useAppDispatch()

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
  liquidityMinted?: CurrencyAmount<Token>
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
} {
  const { address: account } = useAccount()

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
    Boolean(totalSupply && JSBI.equal(totalSupply.quotient, BIG_INT_ZERO)) ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, BIG_INT_ZERO) &&
        JSBI.equal(pair.reserve1.quotient, BIG_INT_ZERO),
    )

  // balances
  const balances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]], [currencies]),
  )
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
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
  if (!account) {
    error = t('Connect Wallet')
  }

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

const MAX_ZAP_REVERSE_RATIO = JSBI.BigInt(50)

const getMaxZapSwapAmount = (pair: Pair, tokenZap: Token) =>
  pair &&
  tokenZap &&
  pair.involvesToken(tokenZap) &&
  JSBI.divide(pair.reserveOf(tokenZap).quotient, MAX_ZAP_REVERSE_RATIO)

// simplify version to guess the zap in amount by swapInAmount from max zap reserves ratio 50
function guessMaxZappableAmount(
  pair: Pair,
  token0AmountIn: CurrencyAmount<Token>,
  token1AmountIn?: CurrencyAmount<Token>,
) {
  if (!token1AmountIn) {
    if (token0AmountIn) {
      const maxSwapAmount = getMaxZapSwapAmount(pair, token0AmountIn.currency)
      return maxSwapAmount && JSBI.multiply(maxSwapAmount, JSBI.BigInt(2))
    }
    return undefined
  }
  if (token0AmountIn && token1AmountIn) {
    const maxSwapAmount = getMaxZapSwapAmount(pair, token0AmountIn.currency)

    if (!maxSwapAmount) {
      return undefined
    }

    const [_, newPair] = pair.getInputAmount(CurrencyAmount.fromRawAmount(token0AmountIn.currency, maxSwapAmount))

    return JSBI.add(
      maxSwapAmount,
      JSBI.divide(
        JSBI.multiply(token1AmountIn.quotient, newPair.reserveOf(token0AmountIn.currency).quotient),
        newPair.reserveOf(token1AmountIn.currency).quotient,
      ),
    )
  }

  return undefined
}

// compare the gas is larger than swap in amount
function useZapInGasOverhead(inputAmount: CurrencyAmount<Currency> | undefined) {
  const gasPrice = useGasPrice()
  const native = useNativeCurrency()
  const requiredGas = formatUnits(gasPrice ? BigNumber.from(gasPrice).mul('500000') : '0')
  const requiredGasAsCurrencyAmount = inputAmount ? tryParseAmount(requiredGas, native) : undefined
  const inputIsBNB = inputAmount?.currency.symbol === 'BNB'

  const gasCostInInputTokens = useTradeExactIn(requiredGasAsCurrencyAmount, inputIsBNB ? null : inputAmount?.currency)

  return gasCostInInputTokens?.outputAmount?.greaterThan(inputAmount?.quotient) ?? false
}

export function useZapIn({
  canZap,
  currencyA,
  currencyB,
  pair,
  currencyBalances,
  zapTokenCheckedA,
  zapTokenCheckedB,
  maxAmounts,
}: {
  canZap?: boolean
  currencyA?: Currency
  currencyB?: Currency
  pair: Pair
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  zapTokenCheckedA?: boolean
  zapTokenCheckedB?: boolean
  maxAmounts?: { [field in Field]?: CurrencyAmount<Currency> }
}) {
  const { t } = useTranslation()
  const [inputBlurOnce, setInputBlurOnce] = useState(false)
  const previousBlur = usePreviousValue(inputBlurOnce)
  const [triedAutoReduce, setTriedAutoReduce] = useState(false)
  const { independentField, typedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )
  const independentAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
    typedValue,
    currencies[independentField],
  )

  const _dependentAmount = useMemo(() => {
    if (!canZap) {
      return undefined
    }
    if (independentAmount) {
      const wrappedIndependentAmount = independentAmount?.wrapped
      const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency.isNative
          ? CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient)
          : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [canZap, currencyA, currencyB, dependentField, independentAmount, pair])

  const isDependentAmountGreaterThanMaxAmount =
    maxAmounts[dependentField] && _dependentAmount && _dependentAmount?.greaterThan(maxAmounts[dependentField])

  // amounts
  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    return isDependentAmountGreaterThanMaxAmount ? maxAmounts[dependentField] : _dependentAmount
  }, [isDependentAmountGreaterThanMaxAmount, maxAmounts, dependentField, _dependentAmount])

  const parsedAmounts: { [field in Field]: CurrencyAmount<Currency> | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: !zapTokenCheckedA
        ? undefined
        : independentField === Field.CURRENCY_A
        ? independentAmount
        : dependentAmount,
      [Field.CURRENCY_B]: !zapTokenCheckedB
        ? undefined
        : independentField === Field.CURRENCY_A
        ? dependentAmount
        : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField, zapTokenCheckedA, zapTokenCheckedB],
  )

  const wrappedParsedAmounts: { [field in Field]: CurrencyAmount<Token> | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: parsedAmounts[Field.CURRENCY_A]?.wrapped,
      [Field.CURRENCY_B]: parsedAmounts[Field.CURRENCY_B]?.wrapped,
    }),
    [parsedAmounts],
  )

  const zapContract = useZapContract(false)

  const rebalancing =
    !!zapTokenCheckedA && !!zapTokenCheckedB && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]

  const singleTokenToZapField =
    !rebalancing && zapTokenCheckedB && !!parsedAmounts[Field.CURRENCY_B] ? Field.CURRENCY_B : Field.CURRENCY_A

  const singleTokenToZapAmount = useMemo(
    () => wrappedParsedAmounts[singleTokenToZapField],
    [singleTokenToZapField, wrappedParsedAmounts],
  )

  const noNeedZap = useMemo(() => {
    if (!rebalancing) {
      return false
    }
    if (!wrappedParsedAmounts[independentField] || !wrappedParsedAmounts[dependentField]) {
      return undefined
    }

    if (!isDependentAmountGreaterThanMaxAmount) {
      return true
    }

    const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]

    if (tokenA && tokenB && wrappedParsedAmounts[independentField] && pair) {
      return wrappedParsedAmounts[dependentField].equalTo(
        dependentField === Field.CURRENCY_B
          ? pair.priceOf(tokenA).quote(wrappedParsedAmounts[independentField])
          : pair.priceOf(tokenB).quote(wrappedParsedAmounts[independentField]),
      )
    }
    return undefined
  }, [
    currencyA,
    currencyB,
    dependentField,
    independentField,
    isDependentAmountGreaterThanMaxAmount,
    pair,
    rebalancing,
    wrappedParsedAmounts,
  ])

  const singleZapEstimate = useSWRContract(
    canZap &&
      !noNeedZap &&
      zapContract &&
      singleTokenToZapAmount &&
      singleTokenToZapAmount?.currency &&
      pair &&
      !rebalancing && {
        contract: zapContract,
        methodName: 'estimateZapInSwap',
        params: [
          singleTokenToZapAmount.currency.address,
          singleTokenToZapAmount.quotient.toString(),
          pair.liquidityToken.address,
        ],
      },
    {
      onError(err) {
        console.error(err)
      },
    },
  )

  const rebalancingZapEstimate = useSWRContract(
    canZap &&
      zapContract &&
      !noNeedZap &&
      wrappedParsedAmounts &&
      wrappedParsedAmounts[Field.CURRENCY_A] &&
      wrappedParsedAmounts[Field.CURRENCY_B] &&
      pair &&
      rebalancing && {
        contract: zapContract,
        methodName: 'estimateZapInRebalancingSwap',
        params: [
          wrappedParsedAmounts[Field.CURRENCY_A].currency.address,
          wrappedParsedAmounts[Field.CURRENCY_B].currency.address,
          wrappedParsedAmounts[Field.CURRENCY_A].quotient.toString(),
          wrappedParsedAmounts[Field.CURRENCY_B]?.quotient?.toString(),
          pair.liquidityToken.address,
        ],
      },
    {
      onError(err) {
        console.error(err)
      },
    },
  )

  const zapInEstimated = useMemo(
    () =>
      (rebalancingZapEstimate?.data || singleZapEstimate?.data) && {
        swapAmountIn: rebalancing ? rebalancingZapEstimate.data?.swapAmountIn : singleZapEstimate.data?.swapAmountIn,
        swapAmountOut: rebalancing ? rebalancingZapEstimate.data?.swapAmountOut : singleZapEstimate.data?.swapAmountOut,
        isToken0Sold: rebalancing
          ? rebalancingZapEstimate.data?.sellToken0
          : singleZapEstimate.data?.swapTokenOut === singleTokenToZapAmount?.currency.address,
      },
    [rebalancing, rebalancingZapEstimate.data, singleZapEstimate.data, singleTokenToZapAmount?.currency.address],
  )

  const rebalancingSellToken0 = useMemo(() => {
    if (rebalancingZapEstimate.data) {
      return rebalancingZapEstimate.data.sellToken0
    }
    if (!pair || !wrappedParsedAmounts[Field.CURRENCY_A] || !wrappedParsedAmounts[Field.CURRENCY_B]) {
      return undefined
    }
    const token0toZap = pair.token0.equals(wrappedParsedAmounts[Field.CURRENCY_A].currency)
    if (token0toZap) {
      return JSBI.greaterThan(
        JSBI.multiply(wrappedParsedAmounts[Field.CURRENCY_A].quotient, pair.reserve1.quotient),
        JSBI.multiply(wrappedParsedAmounts[Field.CURRENCY_B].quotient, pair.reserve0.quotient),
      )
    }
    return JSBI.greaterThan(
      JSBI.multiply(wrappedParsedAmounts[Field.CURRENCY_B].quotient, pair.reserve0.quotient),
      JSBI.multiply(wrappedParsedAmounts[Field.CURRENCY_A].quotient, pair.reserve1.quotient),
    )
  }, [pair, rebalancingZapEstimate.data, wrappedParsedAmounts])

  const swapTokenField = !rebalancing
    ? singleTokenToZapField
    : rebalancingSellToken0
    ? Field.CURRENCY_A
    : Field.CURRENCY_B
  const swapOutTokenField = swapTokenField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const swapTokens: { [field in Field]?: Token } = useMemo(
    () => ({
      [swapTokenField]: currencies[swapTokenField]?.wrapped,
      [swapOutTokenField]: currencies[swapOutTokenField]?.wrapped,
    }),
    [currencies, swapOutTokenField, swapTokenField],
  )

  const zapInEstimatedError = useMemo(
    () => (rebalancing ? rebalancingZapEstimate.error : singleZapEstimate.error),
    [rebalancing, rebalancingZapEstimate.error, singleZapEstimate.error],
  )

  const zapInEstimatedStatus = useMemo(
    () => (rebalancing ? rebalancingZapEstimate.status : singleZapEstimate.status),
    [rebalancing, rebalancingZapEstimate.status, singleZapEstimate.status],
  )

  const priceImpact = useMemo(() => {
    if (!zapInEstimated) {
      return undefined
    }
    const tokenAmountIn = CurrencyAmount.fromRawAmount(
      swapTokens[swapTokenField],
      zapInEstimated.swapAmountIn.toString(),
    )
    const tokenAmountOut = CurrencyAmount.fromRawAmount(
      swapTokens[swapOutTokenField],
      zapInEstimated.swapAmountOut.toString(),
    )
    const midPrice = new Price(
      swapTokens[swapTokenField],
      swapTokens[swapOutTokenField],
      pair.token0.equals(swapTokens[swapTokenField]) ? pair.reserve0.quotient : pair.reserve1.quotient,
      pair.token0.equals(swapTokens[swapTokenField]) ? pair.reserve1.quotient : pair.reserve0.quotient,
    )
    return computePriceImpact(midPrice, tokenAmountIn, tokenAmountOut)
  }, [pair, swapOutTokenField, swapTokenField, swapTokens, zapInEstimated])

  const overLimitZapRatio = useMemo(() => {
    if (!zapInEstimated) {
      return false
    }

    return JSBI.lessThan(
      JSBI.divide(
        pair.reserveOf(swapTokens[swapTokenField]).quotient,
        JSBI.BigInt(zapInEstimated.swapAmountIn.toString()),
      ),
      MAX_ZAP_REVERSE_RATIO,
    )
  }, [pair, swapTokens, zapInEstimated, swapTokenField])

  const priceSeverity = overLimitZapRatio || zapInEstimatedError ? 4 : priceImpact ? warningSeverity(priceImpact) : 0

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(false)

  const maxZappableAmount = useMemo(
    () =>
      guessMaxZappableAmount(
        pair,
        wrappedParsedAmounts[swapTokenField],
        rebalancing ? wrappedParsedAmounts[swapOutTokenField] : undefined,
      ),
    [pair, wrappedParsedAmounts, swapTokenField, rebalancing, swapOutTokenField],
  )

  const convertToMaxZappable = useCallback(() => {
    if (maxZappableAmount) {
      if (maxAmounts[swapTokenField]) {
        const formatInput = formatUnits(
          JSBI.greaterThan(maxAmounts[swapTokenField].quotient, maxZappableAmount)
            ? maxZappableAmount.toString()
            : maxAmounts[swapTokenField].quotient.toString(),
          maxAmounts[swapTokenField]?.currency.decimals,
        )

        if (swapTokenField === Field.CURRENCY_A) {
          onFieldAInput(formatInput)
        } else {
          onFieldBInput(formatInput)
        }
      }
    }
  }, [maxAmounts, maxZappableAmount, onFieldAInput, onFieldBInput, swapTokenField])

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    if (
      !pair ||
      !swapTokens[swapTokenField] ||
      !swapTokens[swapOutTokenField] ||
      !zapInEstimated?.swapAmountIn ||
      !zapInEstimated?.swapAmountOut ||
      !wrappedParsedAmounts[swapTokenField]
    ) {
      return undefined
    }

    if (pair && totalSupply) {
      try {
        // calc the tokenA amount after swap
        const zappedTokenAmountA = wrappedParsedAmounts[swapTokenField].greaterThan(
          zapInEstimated.swapAmountIn.toString(),
        )
          ? wrappedParsedAmounts[swapTokenField].subtract(
              CurrencyAmount.fromRawAmount(swapTokens[swapTokenField], zapInEstimated.swapAmountIn.toString()),
            )
          : wrappedParsedAmounts[swapTokenField]

        let zappedTokenAmountB = CurrencyAmount.fromRawAmount(
          swapTokens[swapOutTokenField],
          zapInEstimated.swapAmountOut.toString(),
        )

        if (wrappedParsedAmounts[swapOutTokenField]) {
          zappedTokenAmountB = zappedTokenAmountB.add(wrappedParsedAmounts[swapOutTokenField])
        }
        const lpMinted = pair.getLiquidityMinted(totalSupply, zappedTokenAmountA, zappedTokenAmountB)
        return lpMinted
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
    return undefined
  }, [
    pair,
    swapTokens,
    swapTokenField,
    swapOutTokenField,
    zapInEstimated?.swapAmountIn,
    zapInEstimated?.swapAmountOut,
    wrappedParsedAmounts,
    totalSupply,
  ])

  const swapTokenAmountTooLow = useMemo(
    () =>
      wrappedParsedAmounts[swapTokenField] &&
      JSBI.lessThan(wrappedParsedAmounts[swapTokenField].quotient, MINIMUM_LIQUIDITY),
    [swapTokenField, wrappedParsedAmounts],
  )
  const swapOutAmountTooLow = useMemo(
    () =>
      wrappedParsedAmounts[swapOutTokenField] &&
      JSBI.lessThan(wrappedParsedAmounts[swapOutTokenField].quotient, MINIMUM_LIQUIDITY),
    [swapOutTokenField, wrappedParsedAmounts],
  )

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  const gasOverhead = useZapInGasOverhead(
    useMemo(
      () =>
        zapInEstimated
          ? CurrencyAmount.fromRawAmount(swapTokens[swapTokenField], zapInEstimated.swapAmountIn.toString())
          : null,
      [swapTokenField, swapTokens, zapInEstimated],
    ),
  )

  useEffect(() => {
    if (
      !triedAutoReduce &&
      parsedAmounts[swapTokenField] &&
      maxZappableAmount &&
      !previousBlur &&
      inputBlurOnce &&
      !rebalancing
    ) {
      if (JSBI.greaterThan(parsedAmounts[swapTokenField].quotient, maxZappableAmount)) {
        convertToMaxZappable()
        setTriedAutoReduce(true)
      }
    }
  }, [
    convertToMaxZappable,
    inputBlurOnce,
    maxZappableAmount,
    parsedAmounts,
    previousBlur,
    rebalancing,
    singleTokenToZapAmount,
    swapTokenField,
    triedAutoReduce,
  ])

  const onInputBlurOnce = useCallback(() => {
    setInputBlurOnce(true)
  }, [])

  let error: string | undefined

  if (zapInEstimatedError) {
    error = t('Cannot estimate zap amount')
  }

  if (swapTokenAmountTooLow || (rebalancing && swapOutAmountTooLow)) {
    error = t('Zap in amount too low')
  }

  if (
    wrappedParsedAmounts[swapTokenField] &&
    currencyBalances[swapTokenField]?.lessThan(wrappedParsedAmounts[swapTokenField])
  ) {
    error = t('Insufficient %token% balance', {
      token: wrappedParsedAmounts[swapTokenField]?.currency.symbol ?? '',
    })
  }

  if (
    wrappedParsedAmounts[swapOutTokenField] &&
    rebalancing &&
    currencyBalances[swapOutTokenField]?.lessThan(wrappedParsedAmounts[swapOutTokenField])
  ) {
    error = t('Insufficient %token% balance', { token: wrappedParsedAmounts[swapOutTokenField]?.currency.symbol ?? '' })
  }

  return {
    zapInEstimating: zapInEstimatedStatus !== FetchStatus.Fetched,
    zapInEstimatedError,
    zapInEstimated,
    error,
    liquidityMinted,
    poolTokenPercentage,
    parsedAmounts,
    swapTokenField,
    swapOutTokenField,
    priceSeverity,
    convertToMaxZappable,
    rebalancing,
    noNeedZap,
    gasOverhead,
    isDependentAmountGreaterThanMaxAmount,
    onInputBlurOnce,
  }
}
