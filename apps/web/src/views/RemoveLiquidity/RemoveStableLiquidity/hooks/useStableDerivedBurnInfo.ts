import { Currency, CurrencyAmount, Percent, Token } from '@pancakeswap/sdk'

import { useTranslation } from '@pancakeswap/localization'
import { useQuery } from '@tanstack/react-query'
import { useInfoStableSwapContract } from 'hooks/useContract'
import { useContext, useMemo } from 'react'
import { Field } from 'state/burn/actions'
import { useRemoveLiquidityV2FormState } from 'state/burn/reducer'
import { useTokenBalances } from 'state/wallet/hooks'
import { Address } from 'viem'
import { StablePair, useStablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'
import { StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import { useAccount } from 'wagmi'

export function useGetRemovedTokenAmounts({ lpAmount }: { lpAmount?: string }) {
  const stableConfigContext = useContext(StableConfigContext)

  return useGetRemovedTokenAmountsNoContext({
    stableSwapInfoContract: stableConfigContext?.stableSwapInfoContract,
    stableSwapAddress: stableConfigContext?.stableSwapConfig?.stableSwapAddress,
    lpAmount,
    token0: stableConfigContext?.stableSwapConfig?.token0.wrapped,
    token1: stableConfigContext?.stableSwapConfig?.token1.wrapped,
  })
}

export function useGetRemovedTokenAmountsNoContext({
  lpAmount,
  stableSwapAddress,
  token0,
  token1,
  stableSwapInfoContract,
}: {
  lpAmount?: string
  stableSwapAddress?: string
  token0?: Token
  token1?: Token
  stableSwapInfoContract?: ReturnType<typeof useInfoStableSwapContract>
}) {
  const { data } = useQuery({
    queryKey: ['stableSwapInfoContract', 'calc_coins_amount', stableSwapAddress, lpAmount],

    queryFn: async () => {
      if (!stableSwapInfoContract || !lpAmount) return undefined
      return stableSwapInfoContract.read.calc_coins_amount([stableSwapAddress as Address, BigInt(lpAmount)])
    },

    enabled: Boolean(lpAmount),
  })

  if (!Array.isArray(data) || !token0 || !token1) return []

  const tokenAAmount = CurrencyAmount.fromRawAmount(token0, data[0].toString())
  const tokenBAmount = CurrencyAmount.fromRawAmount(token1, data[1].toString())

  return [tokenAAmount, tokenBAmount]
}

export function useStableDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  pair?: StablePair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  error?: string
  tokenToReceive?: string
} {
  const { address: account } = useAccount()

  const { independentField, typedValue } = useRemoveLiquidityV2FormState()

  const { t } = useTranslation()

  // pair + totalsupply
  const { pair } = useStablePair(currencyA?.wrapped, currencyB?.wrapped)

  // balances
  const relevantTokenBalances = useTokenBalances(
    account ?? undefined,
    useMemo(() => [pair?.liquidityToken || undefined], [pair?.liquidityToken]),
  )
  const userLiquidity: undefined | CurrencyAmount<Token> = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }

  const liquidityToRemove =
    userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
      ? CurrencyAmount.fromRawAmount(userLiquidity.currency, percentToRemove.multiply(userLiquidity.quotient).quotient)
      : undefined

  const [amountA, amountB] = useGetRemovedTokenAmounts({
    lpAmount: liquidityToRemove?.quotient?.toString(),
  })

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Token>
    [Field.CURRENCY_B]?: CurrencyAmount<Token>
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]: liquidityToRemove,
    [Field.CURRENCY_A]: amountA,
    [Field.CURRENCY_B]: amountB,
  }

  let error: string | undefined
  if (!account) {
    error = t('Connect Wallet')
  }

  if (!parsedAmounts[Field.LIQUIDITY]) {
    error = error ?? t('Enter an amount')
  }

  return { pair, parsedAmounts, error }
}
