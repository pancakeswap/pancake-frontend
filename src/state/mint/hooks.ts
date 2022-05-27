import { formatUnits } from '@ethersproject/units'
import {
  Currency,
  CurrencyAmount,
  ETHER,
  JSBI,
  Pair,
  Percent,
  Price,
  Token,
  TokenAmount,
  Route,
} from '@pancakeswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairState, usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { LIQUIDLY_MINIMUM_AMOUNT } from 'config/constants'

import { computePriceImpact, warningSeverity } from 'utils/prices'
import { useTranslation } from 'contexts/Localization'
import { wrappedCurrency, wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { useZapContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'
import { FetchStatus } from 'config/constants/types'
import tryParseAmount from 'utils/tryParseAmount'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

const ZERO = JSBI.BigInt(0)

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>((state) => state.mint)
}

export function useMintActionHandlers(
  noLiquidity: boolean | undefined,
  zap?: boolean,
): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true, zap: zap === true }))
    },
    [dispatch, noLiquidity, zap],
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true, zap: zap === true }))
    },
    [dispatch, noLiquidity, zap],
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
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
} {
  const { account, chainId } = useActiveWeb3React()

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
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency === ETHER ? CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, chainId, currencyB, pair])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
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
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)
      }
      return undefined
    }
    const wrappedCurrencyA = wrappedCurrency(currencyA, chainId)
    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
  }, [chainId, currencyA, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
    return undefined
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  let addError: string | undefined
  if (!account) {
    error = t('Connect Wallet')
  }

  if (pairState === PairState.INVALID) {
    error = error ?? t('Invalid pair')
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    addError = addError ?? t('Enter an amount')
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

  // if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
  //   addError = t('Enter an amount')
  // }

  // TODO
  // if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
  //   addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol })
  // }a

  // if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
  //   addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol })
  // }

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

export function useZapIn({
  rebalancing,
  canZap,
  currencyA,
  currencyB,
  pair,
  currencyBalances,
  zapTokenCheckedA,
  zapTokenCheckedB,
  maxAmounts,
}: {
  rebalancing?: boolean
  canZap?: boolean
  currencyA?: Currency
  currencyB?: Currency
  pair: Pair
  currencyBalances: { [field in Field]?: CurrencyAmount }
  zapTokenCheckedA?: boolean
  zapTokenCheckedB?: boolean
  maxAmounts?: { [field in Field]?: TokenAmount }
}) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    return tryParseAmount(otherTypedValue, currencies[dependentField])
  }, [dependentField, otherTypedValue, currencies])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
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

  const wrappedParsedAmounts: { [field in Field]: TokenAmount | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: wrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_A], chainId),
      [Field.CURRENCY_B]: wrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_B], chainId),
    }),
    [chainId, parsedAmounts],
  )

  const zapContract = useZapContract()

  const singleTokenToZapField = !rebalancing && zapTokenCheckedB ? Field.CURRENCY_B : Field.CURRENCY_A
  const singleTokenToZapAmount = useMemo(
    () => wrappedParsedAmounts[singleTokenToZapField],
    [singleTokenToZapField, wrappedParsedAmounts],
  )

  const singleZapEstimate = useSWRContract(
    canZap &&
      zapContract &&
      singleTokenToZapAmount &&
      singleTokenToZapAmount?.token &&
      !rebalancing && {
        contract: zapContract,
        methodName: 'estimateZapInSwap',
        params: [
          singleTokenToZapAmount.token.address,
          singleTokenToZapAmount.raw.toString(),
          pair.liquidityToken.address,
        ],
      },
  )

  const rebalancingZapEstimate = useSWRContract(
    canZap &&
      zapContract &&
      wrappedParsedAmounts &&
      wrappedParsedAmounts[Field.CURRENCY_A] &&
      wrappedParsedAmounts[Field.CURRENCY_B] &&
      rebalancing && {
        contract: zapContract,
        methodName: 'estimateZapInRebalancingSwap',
        params: [
          wrappedParsedAmounts[Field.CURRENCY_A].token.address,
          wrappedParsedAmounts[Field.CURRENCY_B].token.address,
          wrappedParsedAmounts[Field.CURRENCY_A].raw.toString(),
          wrappedParsedAmounts[Field.CURRENCY_B]?.raw?.toString(),
          pair.liquidityToken.address,
        ],
      },
  )

  const zapInEstimated = useMemo(
    () =>
      (rebalancingZapEstimate?.data || singleZapEstimate?.data) && {
        swapAmountIn: rebalancing ? rebalancingZapEstimate.data?.swapAmountIn : singleZapEstimate.data?.swapAmountIn,
        swapAmountOut: rebalancing ? rebalancingZapEstimate.data?.swapAmountOut : singleZapEstimate.data?.swapAmountOut,
        isToken0Sold: rebalancing
          ? rebalancingZapEstimate.data?.sellToken0
          : singleZapEstimate.data?.swapTokenOut === singleTokenToZapAmount?.token.address,
      },
    [rebalancing, rebalancingZapEstimate.data, singleZapEstimate.data, singleTokenToZapAmount?.token.address],
  )

  const swapTokenField = !rebalancing
    ? singleTokenToZapField
    : rebalancingZapEstimate.data?.sellToken0
    ? Field.CURRENCY_A
    : Field.CURRENCY_B
  const swapOutTokenField = swapTokenField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const swapTokens: { [field in Field]?: Token } = useMemo(
    () => ({
      [swapTokenField]: wrappedCurrency(currencies[swapTokenField], chainId),
      [swapOutTokenField]: wrappedCurrency(currencies[swapOutTokenField], chainId),
    }),
    [chainId, currencies, swapOutTokenField, swapTokenField],
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
    const tokenAmountIn = new TokenAmount(swapTokens[swapTokenField], zapInEstimated.swapAmountIn.toString())
    const tokenAmountOut = new TokenAmount(swapTokens[swapOutTokenField], zapInEstimated.swapAmountOut.toString())
    const midPrice = Price.fromRoute(new Route([pair], currencies[swapTokenField]))
    return computePriceImpact(midPrice, tokenAmountIn, tokenAmountOut)
  }, [currencies, pair, swapOutTokenField, swapTokenField, swapTokens, zapInEstimated])

  const priceSeverity = priceImpact ? warningSeverity(priceImpact) : 0

  const maxZapByRatio = useMemo(() => {
    return (
      pair &&
      swapTokens[swapTokenField] &&
      JSBI.divide(pair.reserveOf(swapTokens[swapTokenField]).raw, MAX_ZAP_REVERSE_RATIO)
    )
  }, [pair, swapTokenField, swapTokens])

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(false, true)

  const convertToMaxZappable = useCallback(() => {
    if (maxZapByRatio) {
      if (!rebalancing) {
        if (swapTokenField === Field.CURRENCY_A && maxAmounts[Field.CURRENCY_A]) {
          onFieldAInput(
            formatUnits(
              JSBI.greaterThan(maxAmounts[Field.CURRENCY_A].raw, maxZapByRatio)
                ? maxZapByRatio.toString()
                : maxAmounts[Field.CURRENCY_A].raw.toString(),
              maxAmounts[Field.CURRENCY_A]?.currency.decimals,
            ),
          )
        }
        if (swapTokenField === Field.CURRENCY_B && maxAmounts[Field.CURRENCY_B]) {
          onFieldBInput(
            formatUnits(
              JSBI.greaterThan(maxAmounts[Field.CURRENCY_B].raw, maxZapByRatio)
                ? maxZapByRatio.toString()
                : maxAmounts[Field.CURRENCY_B].raw.toString(),
              maxAmounts[Field.CURRENCY_B]?.currency.decimals,
            ),
          )
        }
      }
    }
  }, [maxAmounts, maxZapByRatio, onFieldAInput, onFieldBInput, rebalancing, swapTokenField])

  const overLimitZapRatio = useMemo(
    () =>
      zapInEstimated &&
      JSBI.lessThan(
        JSBI.divide(
          pair.reserveOf(swapTokens[swapTokenField]).raw,
          JSBI.BigInt(zapInEstimated.swapAmountIn.toString()),
        ),
        MAX_ZAP_REVERSE_RATIO,
      ),
    [pair, swapTokens, zapInEstimated, swapTokenField],
  )

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    if (
      !pair ||
      !swapTokens[swapTokenField] ||
      !swapTokens[swapOutTokenField] ||
      !zapInEstimated?.swapAmountIn ||
      !zapInEstimated?.swapAmountOut ||
      !wrappedParsedAmounts[swapTokenField] ||
      !wrappedParsedAmounts[swapOutTokenField]
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
              new TokenAmount(swapTokens[swapTokenField], zapInEstimated.swapAmountIn.toString()),
            )
          : wrappedParsedAmounts[swapTokenField]

        let zappedTokenAmountB = new TokenAmount(swapTokens[swapOutTokenField], zapInEstimated.swapAmountOut.toString())

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
      JSBI.lessThan(wrappedParsedAmounts[swapTokenField].raw, LIQUIDLY_MINIMUM_AMOUNT),
    [swapTokenField, wrappedParsedAmounts],
  )
  const swapOutAmountTooLow = useMemo(
    () =>
      wrappedParsedAmounts[swapOutTokenField] &&
      JSBI.lessThan(wrappedParsedAmounts[swapOutTokenField].raw, LIQUIDLY_MINIMUM_AMOUNT),
    [swapOutTokenField, wrappedParsedAmounts],
  )

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined

  if (zapInEstimatedError) {
    error = t('Zap Estimating error')
  }

  if (overLimitZapRatio) {
    error = t('Quantity higher than limit')
  }

  if (swapTokenAmountTooLow || (rebalancing && swapOutAmountTooLow)) {
    error = t('Zap in amount too low')
  }

  if (
    wrappedParsedAmounts[swapTokenField] &&
    currencyBalances[swapTokenField]?.lessThan(wrappedParsedAmounts[swapTokenField])
  ) {
    error = t('Insufficient %token% balance', {
      token: wrappedParsedAmounts[singleTokenToZapField]?.token.symbol ?? '',
    })
  }

  if (
    wrappedParsedAmounts[swapOutTokenField] &&
    rebalancing &&
    currencyBalances[swapOutTokenField]?.lessThan(wrappedParsedAmounts[swapOutTokenField])
  ) {
    error = t('Insufficient %token% balance', { token: wrappedParsedAmounts[swapOutTokenField]?.token.symbol ?? '' })
  }

  return {
    zapInEstimating: zapInEstimatedStatus !== FetchStatus.Fetched,
    zapInEstimatedError,
    overLimitZapRatio,
    zapInEstimated,
    error,
    liquidityMinted,
    poolTokenPercentage,
    parsedAmounts,
    swapTokenField,
    swapOutTokenField,
    priceSeverity,
    convertToMaxZappable,
  }
}
