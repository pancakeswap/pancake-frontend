import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import { getLPOutputWithoutFee, getSwapOutputWithoutFee } from '@pancakeswap/stable-swap-sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useContext, useMemo } from 'react'

import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useStableSwapInfo } from 'hooks/useStableSwapInfo'
import { StableConfigContext } from 'views/Swap/hooks/useStableConfig'

export function useDerivedLPInfo(
  amountA: CurrencyAmount<Currency> | undefined,
  amountB: CurrencyAmount<Currency> | undefined,
): {
  lpOutputWithoutFee: CurrencyAmount<Currency> | null
  price: Price<Currency, Currency> | null
  loading: boolean
} {
  const { stableSwapConfig } = useContext(StableConfigContext) || {}
  const { totalSupply, balances, amplifier, loading } = useStableSwapInfo(
    stableSwapConfig?.stableSwapAddress,
    stableSwapConfig?.liquidityToken.address,
  )
  const wrappedCurrencyA = amountA?.currency.wrapped
  const wrappedCurrencyB = amountB?.currency.wrapped
  const [token0, token1] =
    wrappedCurrencyA && wrappedCurrencyB && wrappedCurrencyA?.sortsBefore(wrappedCurrencyB)
      ? [wrappedCurrencyA, wrappedCurrencyB]
      : [wrappedCurrencyB, wrappedCurrencyA]
  const [amount0, amount1] =
    wrappedCurrencyA && token0 && token0.equals(wrappedCurrencyA) ? [amountA, amountB] : [amountB, amountA]
  const poolBalances = useMemo<[CurrencyAmount<Currency>, CurrencyAmount<Currency>] | undefined>(
    () =>
      token0 && token1 && balances[0] && balances[1]
        ? [CurrencyAmount.fromRawAmount(token0, balances[0]), CurrencyAmount.fromRawAmount(token1, balances[1])]
        : undefined,
    [balances, token0, token1],
  )
  const totalSupplyAmount = useMemo(
    () =>
      totalSupply &&
      stableSwapConfig?.liquidityToken &&
      CurrencyAmount.fromRawAmount(stableSwapConfig.liquidityToken, totalSupply),
    [totalSupply, stableSwapConfig?.liquidityToken],
  )
  return useMemo(() => {
    const emptyResult = {
      loading,
      lpOutputWithoutFee: null,
      price: null,
    }
    if (!totalSupplyAmount || !poolBalances || !amount0 || !amount1 || !amplifier || !amountA || !amountB) {
      return emptyResult
    }
    const totalValue = poolBalances[0].quotient + poolBalances[1].quotient
    if (totalValue === BIG_INT_ZERO) {
      return emptyResult
    }
    let lpOutputWithoutFee: CurrencyAmount<Currency> | null = null
    let price: Price<Currency, Currency> | null = null
    try {
      lpOutputWithoutFee = getLPOutputWithoutFee({
        amplifier,
        balances: poolBalances,
        totalSupply: totalSupplyAmount,
        amounts: [amount0, amount1],
      })
      const baseAmount = tryParseAmount('1', amountA.currency)
      if (!baseAmount) {
        return emptyResult
      }
      const quoteAmount = getSwapOutputWithoutFee({
        amplifier,
        balances: poolBalances,
        amount: baseAmount,
        outputCurrency: amountB.currency,
      })
      price = new Price({ baseAmount, quoteAmount })
    } catch (e) {
      console.error(e)
    }
    return {
      loading,
      lpOutputWithoutFee,
      price,
    }
  }, [totalSupplyAmount, poolBalances, amplifier, loading, amount0, amount1, amountA, amountB])
}
