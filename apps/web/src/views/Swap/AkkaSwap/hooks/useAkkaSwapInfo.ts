import { useWeb3React } from '@pancakeswap/wagmi'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { isAddress } from 'utils'

import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { AkkaRouterTrade } from './types'
import { useAkkaRouterRouteWithArgs } from './useAkkaRouterApi'
import { useIsAkkaSwapModeStatus } from 'state/global/hooks'
import { useEffect } from 'react'

// from the current swap inputs, compute the best trade and return it.
export function useAkkaSwapInfo(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  allowedSlippage: number,
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  trade: AkkaRouterTrade
  inputError?: string
} {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const to: string | null = account ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const { route, args } = useAkkaRouterRouteWithArgs(inputCurrency, outputCurrency, typedValue, allowedSlippage)

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  }
  return {
    currencies,
    currencyBalances,
    parsedAmount,
    trade: {
      route: route?.data ?? null,
      args: args?.data ?? null,
    },
    inputError,
  }
}
