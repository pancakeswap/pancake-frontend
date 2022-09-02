import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, JSBI, Pair, Percent, Price, Token } from '@pancakeswap/sdk'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { PairState } from 'hooks/usePairs'

import useTotalSupply from 'hooks/useTotalSupply'
import { useMemo } from 'react'

import tryParseAmount from 'utils/tryParseAmount'
import { Field } from 'state/mint/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import useStableConfig from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useEstimatedAmount } from 'views/Swap/StableSwap/hooks/useStableTradeExactIn'
import useSWR from 'swr'
import { useMintState } from 'state/mint/hooks'

function useStablePair(currencyA, currencyB): [PairState, Pair | null] {
  const { stableSwapConfig } = useStableConfig({ tokenAAddress: currencyA?.address, tokenBAddress: currencyB?.address })

  if (!stableSwapConfig) {
    return [PairState.NOT_EXISTS, undefined]
  }

  // Philip TODO: sortby order and get reserve amount
  const reserve0 = CurrencyAmount.fromRawAmount(stableSwapConfig?.token0, '0')
  const reserve1 = CurrencyAmount.fromRawAmount(stableSwapConfig?.token1, '1')
  const tokenAmounts = [reserve0, reserve1]

  const pair = {
    liquidityToken: stableSwapConfig?.lpAddress
      ? new Token(currencyA?.chainId, stableSwapConfig?.lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs')
      : null,
    tokenAmounts,
    reserve0,
    reserve1,
    token0: tokenAmounts[0].currency,
    token1: tokenAmounts[1].currency,
    getLiquidityValue: () => reserve0,
  }

  return [PairState.EXISTS, pair]
}

function useMintedStabelLP({
  stableSwapInfoContract,
  stableSwapConfig,
  stableSwapAddress,
  currencyA,
  currencyAAmount,
  currencyBAmount,
}) {
  const quotient0Str = currencyAAmount?.toString()
  const quotient1Str = currencyBAmount?.toString()

  const isValid = !!stableSwapAddress && !!quotient0Str && !!quotient1Str

  return useSWR(
    isValid ? ['get_add_liquidity_mint_amount', stableSwapAddress, quotient0Str, quotient1Str] : null,
    async () => {
      const isToken0 = stableSwapConfig?.token0?.address === currencyA?.address

      const args = isToken0 ? [quotient0Str, quotient1Str] : [quotient1Str, quotient0Str]

      const estimatedAmount = await stableSwapInfoContract.get_add_liquidity_mint_amount(...[stableSwapAddress, args])

      return estimatedAmount
    },
  )
}

export function useStableLPDerivedMintInfo(
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
  const [pairState, pair] = useStablePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])

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
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ])
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

  const { stableSwapConfig, stableSwapContract, stableSwapInfoContract } = useStableConfig({
    tokenAAddress: currencies[Field.CURRENCY_A]?.address,
    tokenBAddress: currencies[Field.CURRENCY_B]?.address,
  })

  const parsedAAmount = parsedAmounts[Field.CURRENCY_A]?.quotient
  const parsedBAmount = parsedAmounts[Field.CURRENCY_B]?.quotient

  const { data: estimatedOutputAmount } = useEstimatedAmount({
    currency: parsedAAmount ? currencies[Field.CURRENCY_A] : currencies[Field.CURRENCY_B],
    quotient: parsedAAmount ? parsedAAmount?.toString() : parsedBAmount?.toString(),
    stableSwapConfig,
    stableSwapContract,
    isParamInvalid: !stableSwapConfig?.stableSwapAddress,
  })

  const price = useMemo(() => {
    if ((parsedAAmount || parsedBAmount) && estimatedOutputAmount) {
      return parsedAAmount
        ? new Price(
            currencies[Field.CURRENCY_A],
            currencies[Field.CURRENCY_B],
            parsedAAmount,
            estimatedOutputAmount.quotient,
          )
        : new Price(
            currencies[Field.CURRENCY_A],
            currencies[Field.CURRENCY_B],
            estimatedOutputAmount.quotient,
            parsedBAmount,
          )
    }
    return undefined
  }, [estimatedOutputAmount, currencies, parsedBAmount, parsedAAmount])

  const { data: lpMinted } = useMintedStabelLP({
    stableSwapAddress: stableSwapConfig?.stableSwapAddress,
    stableSwapInfoContract,
    stableSwapConfig,
    currencyA: parsedAAmount ? currencies[Field.CURRENCY_A] : currencies[Field.CURRENCY_B],
    currencyAAmount: parsedAAmount || parsedBAmount,
    currencyBAmount: parsedAAmount ? parsedBAmount : parsedAAmount,
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
