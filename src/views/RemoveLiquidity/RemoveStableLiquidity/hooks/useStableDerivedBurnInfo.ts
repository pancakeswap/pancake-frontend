import { Currency, CurrencyAmount, Percent, Token } from '@pancakeswap/sdk'

import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/burn/actions'
import { useTokenBalances } from 'state/wallet/hooks'
import { useBurnState } from 'state/burn/hooks'
import { StablePair, useStablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'
import { StableConfigContext } from 'views/Swap/StableSwap/hooks/useStableConfig'
import useSWR from 'swr'
import { useContext } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'

export function useGetRemovedTokenAmounts({ lpAmount }) {
  const { stableSwapInfoContract, stableSwapConfig } = useContext(StableConfigContext)

  const { data } = useSWR(
    !lpAmount ? null : ['stableSwapInfoContract', 'calc_coins_amount', stableSwapConfig?.stableSwapAddress, lpAmount],
    async () => {
      return stableSwapInfoContract.calc_coins_amount(stableSwapConfig?.stableSwapAddress, lpAmount)
    },
  )

  if (!Array.isArray(data)) return []

  const tokenAAmount = CurrencyAmount.fromRawAmount(stableSwapConfig?.token0, data[0].toString())
  const tokenBAmount = CurrencyAmount.fromRawAmount(stableSwapConfig?.token1, data[1].toString())

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
  const { account } = useWeb3React()

  const { independentField, typedValue } = useBurnState()

  const { t } = useTranslation()

  // pair + totalsupply
  const { pair } = useStablePair(currencyA?.wrapped, currencyB?.wrapped)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
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
