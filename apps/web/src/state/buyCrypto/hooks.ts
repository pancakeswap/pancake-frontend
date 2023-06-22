import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect } from 'react'
import { BuyCryptoState, buyCryptoReducerAtom } from 'state/buyCrypto/reducer'
import { useAccount } from 'wagmi'
import toString from 'lodash/toString'
import { useActiveChainId } from 'hooks/useActiveChainId'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import ceil from 'lodash/ceil'

import { MOONPAY_BASE_URL } from 'config/constants/endpoints'
import { Field, replaceBuyCryptoState, selectCurrency, setMinAmount, setUsersIpAddress, typeInput } from './actions'

type CurrencyLimits = {
  code: string
  maxBuyAmount: number
  minBuyAmount: number
}

export function useBuyCryptoState() {
  return useAtomValue(buyCryptoReducerAtom)
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

export const fetchMinimumBuyAmount = async (
  inputCurrencyId: string,
  outputCurrencyId: string,
): Promise<{ [curr: string]: CurrencyLimits }> => {
  try {
    const response = await fetch(
      `${MOONPAY_BASE_URL}/v3/currencies/${outputCurrencyId.toLowerCase()}/limits?apiKey=pk_live_Ch5fat39X8NvMZwih2k7hK4sDrKanSPz&baseCurrencyCode=${inputCurrencyId.toLowerCase()}&areFeesIncluded=true`,
    )

    // console.log(await response.json())
    if (!response.ok) {
      throw new Error('Failed to fetch minimum buy amount')
    }

    const data = await response.json()

    if (!data.baseCurrency || !data.quoteCurrency) {
      throw new Error('Invalid response data')
    }

    const minAmounts: { [curr: string]: CurrencyLimits } = { base: data.baseCurrency, quote: data.quoteCurrency }
    return minAmounts
  } catch (error) {
    console.error('An error occurred while fetching the minimum buy amount:', error)
    return {}
  }
}

// from the current swap inputs, compute the best trade and return it.
export function useBuyCryptoErrorInfo(
  typedValue: string,
  minAmount: number,
  minBaseAmount: number,
  maxAmount: number,
  maxBaseAmount: number,
  inputCurrencyId: string,
  outputCurrencyId: string,
): {
  amountError: string | undefined
  inputError: string
} {
  const { address: account } = useAccount()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  let inputError: string | undefined
  const isMinError = Number(typedValue) < minAmount
  const isMaxError = Number(typedValue) > maxAmount

  let amountError: undefined | string

  if (isMinError) {
    amountError = t(
      'The minimum purchasable amount is %minAmount% %fiatCurrency% / %minCryptoAmount% %cryptoCurrency%',
      {
        minAmount: formatLocaleNumber({
          number: minAmount,
          locale,
        }),
        fiatCurrency: inputCurrencyId,
        minCryptoAmount: formatLocaleNumber({ locale, number: maxBaseAmount }),
        cryptoCurrency: outputCurrencyId,
      },
    )
  } else if (isMaxError) {
    amountError = t(
      'The maximum purchasable amount is %maxAmount% %fiatCurrency% / %maxCryptoAmount% %cryptoCurrency%',
      {
        maxAmount: formatLocaleNumber({
          number: maxAmount,
          locale,
        }),
        fiatCurrency: inputCurrencyId,
        maxCryptoAmount: formatLocaleNumber({ locale, number: maxBaseAmount }),
        cryptoCurrency: outputCurrencyId,
      },
    )
  }

  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (isMinError) {
    inputError = inputError ?? t('Amount too low')
  } else if (isMaxError) {
    inputError = inputError ?? t('Amount too high')
  }

  if (typedValue === '') {
    inputError = inputError ?? t('Enter an amount')
  }

  return {
    amountError,
    inputError,
  }
}

export function useBuyCryptoActionHandlers(): {
  onFieldAInput: (typedValue: string) => void
  onCurrencySelection: (field: Field, currency: Currency) => void
  onLimitAmountUpdate: (minAmount: number, minBaseAmount: number, maxAmount: number, maxBaseAmount: number) => void
  onUsersIp: (ip: string | null) => void
} {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch],
  )

  const onCurrencySelection = useCallback((field: Field, currency: Currency) => {
    dispatch(
      selectCurrency({
        field,
        currencyId: currency.symbol,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLimitAmountUpdate = useCallback(
    (minAmount: number, minBaseAmount: number, maxAmount: number, maxBaseAmount: number) => {
      dispatch(
        setMinAmount({
          minAmount,
          minBaseAmount,
          maxAmount,
          maxBaseAmount,
        }),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const onUsersIp = useCallback((ip: string | null) => {
    dispatch(
      setUsersIpAddress({
        ip,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onFieldAInput,
    onCurrencySelection,
    onLimitAmountUpdate,
    onUsersIp,
  }
}

const DEFAULT_FIAT_CURRENCY = 'USD'

export async function queryParametersToBuyCryptoState(
  parsedQs: ParsedUrlQuery,
  account: string | undefined,
  chainId: number,
): Promise<BuyCryptoState> {
  const inputCurrency = parsedQs.inputCurrency || chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'
  const limitAmounts = await fetchMinimumBuyAmount(DEFAULT_FIAT_CURRENCY, inputCurrency)

  return {
    [Field.INPUT]: {
      currencyId: DEFAULT_FIAT_CURRENCY,
    },
    [Field.OUTPUT]: {
      currencyId: inputCurrency as string,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    // UPDATE
    minAmount: limitAmounts.base.minBuyAmount,
    minBaseAmount: limitAmounts.quote.minBuyAmount,
    maxAmount: limitAmounts.base.maxBuyAmount,
    maxBaseAmount: limitAmounts.quote.maxBuyAmount,
    recipient: account,
    userIpAddress: null,
  }
}

export function calculateDefaultAmount(minAmount: number): number {
  return ceil(minAmount * 4)
}

export function useDefaultsFromURLSearch(account: string | undefined) {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)
  const { chainId } = useActiveChainId()
  const { query, isReady } = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady || !chainId) return
      const parsed = await queryParametersToBuyCryptoState(query, account, chainId)

      dispatch(
        replaceBuyCryptoState({
          typedValue: toString(calculateDefaultAmount(parsed.minAmount)),
          minAmount: parsed.minAmount,
          minBaseAmount: parsed.minBaseAmount,
          maxAmount: parsed.maxAmount,
          maxBaseAmount: parsed.maxBaseAmount,
          inputCurrencyId: parsed[Field.OUTPUT].currencyId,
          outputCurrencyId: parsed[Field.INPUT].currencyId,
          recipient: null,
        }),
      )
    }
    fetchData()
  }, [dispatch, query, isReady, account, chainId])

  // return result
}
