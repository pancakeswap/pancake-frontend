import { Currency, CurrencyAmount, Pair } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrencyBalance } from 'hooks/Balances'
import { PairState, usePair } from 'hooks/usePairs'
import { createContext, useMemo } from 'react'
import { Field } from '../state/add/actions'

interface MintPairContextValue {
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  error?: string
}

export const MintPairContext = createContext<MintPairContextValue>({
  pair: undefined,
  pairState: PairState.LOADING,
  currencyBalances: {
    [Field.CURRENCY_A]: undefined,
    [Field.CURRENCY_B]: undefined,
  },
  error: '',
})

export default function useMintPair({ currencyA, currencyB }): MintPairContextValue {
  const { t } = useTranslation()

  // pair
  const [pairState, pair] = usePair(currencyA, currencyB)

  const balanceA = useCurrencyBalance(currencyA?.wrapped.address)
  const balanceB = useCurrencyBalance(currencyB?.wrapped.address)

  // balances
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = useMemo(
    () => ({
      [Field.CURRENCY_A]: balanceA,
      [Field.CURRENCY_B]: balanceB,
    }),
    [balanceA, balanceB],
  )

  let error: string | undefined

  if (pairState === PairState.INVALID) {
    error = error ?? t('Choose a valid pair')
  }

  // Philip TODO: turn into ||
  if (currencyBalances?.[Field.CURRENCY_A]?.equalTo(0) && currencyBalances?.[Field.CURRENCY_B]?.equalTo(0)) {
    error = error ?? t('No token balance')
  }

  return useMemo(
    () => ({
      pair,
      pairState,
      currencyBalances,
      error,
    }),
    [pair, pairState, currencyBalances, error],
  )
}
