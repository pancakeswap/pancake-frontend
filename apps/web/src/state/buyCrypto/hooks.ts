import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import ceil from 'lodash/ceil'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect, useMemo } from 'react'
import { BuyCryptoState, buyCryptoReducerAtom } from 'state/buyCrypto/reducer'
import {
  OnRampChainId as ChainId,
  OnRampCurrency as Currency,
  fiatCurrencyMap,
  onRampCurrenciesMap,
} from 'views/BuyCrypto/constants'
import { useAccount } from 'wagmi'
import { Field, replaceBuyCryptoState, selectCurrency, switchCurrencies, typeInput } from './actions'

const allowTwoDecimalRegex = RegExp(`^\\d+(\\.\\d{0,2})?$`)

const useEnableBtcPurchases = atomWithStorage<boolean>('pcs:enable-buy-btc-native', false)

export function useAllowBtcPurchases() {
  return useAtom(useEnableBtcPurchases)
}

export function useBuyCryptoState() {
  return useAtomValue(buyCryptoReducerAtom)
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

export function extractBeforeDashX(str) {
  const parts = str.split('-x')
  return parts[0]
}

export function useBuyCryptoActionHandlers(): {
  onFieldAInput: (typedValue: string) => void
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      if (typedValue === '' || allowTwoDecimalRegex.test(typedValue)) {
        dispatch(typeInput({ field: Field.INPUT, typedValue }))
      }
    },
    [dispatch],
  )

  const onCurrencySelection = useCallback((field: Field, currency: Currency) => {
    dispatch(
      selectCurrency({
        field,
        currencyId: field === Field.OUTPUT ? currency.symbol : `${currency.symbol}_${currency.chainId}`,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUserInput = useCallback((field: Field, typedValue: string) => {
    dispatch(typeInput({ field, typedValue }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onFieldAInput,
    onCurrencySelection,
    onSwitchTokens,
    onUserInput,
  }
}
export const useIsInputAFiat = () => {
  const { independentField } = useBuyCryptoState()
  return Boolean(independentField === Field.INPUT)
}

export const useOnRampCurrencies = () => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  const { cryptoCurrency, fiatCurrency } = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId)
      return { cryptoCurrency: onRampCurrenciesMap.BNB_56, fiatCurrency: fiatCurrencyMap.USD }
    const isInputAFiat = Object.keys(fiatCurrencyMap).includes(inputCurrencyId)

    const cryptoCurr = isInputAFiat ? onRampCurrenciesMap[outputCurrencyId] : onRampCurrenciesMap[inputCurrencyId]
    const fiatCurr = isInputAFiat ? fiatCurrencyMap[inputCurrencyId] : fiatCurrencyMap[outputCurrencyId]

    return { cryptoCurrency: cryptoCurr, fiatCurrency: fiatCurr }
  }, [inputCurrencyId, outputCurrencyId])

  return { cryptoCurrency, fiatCurrency }
}
export async function queryParametersToBuyCryptoState(
  parsedQs: ParsedUrlQuery,
  account: string | undefined,
  chainId: any,
): Promise<BuyCryptoState> {
  const DEFAULT_FIAT_CURRENCY = [ChainId.BASE, ChainId.LINEA].includes(chainId) ? 'EUR' : 'USD'
  return {
    [Field.INPUT]: {
      currencyId: DEFAULT_FIAT_CURRENCY,
    },
    [Field.OUTPUT]: {
      currencyId: 'BNB_56',
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    // UPDATE
    recipient: account,
    independentField: Field.INPUT,
    inputFlowType: 'fiat',
  }
}

export function calculateDefaultAmount(minAmount: number, currencyCode: string | undefined): number {
  switch (currencyCode) {
    case 'USD':
      return 300
    case 'EUR':
      return 200
    case 'GBP':
      return 200
    case 'HKD':
      return 2000
    case 'CAD':
      return 400
    case 'AUD':
      return 400
    case 'BRL':
      return 1000
    case 'JPY':
      return 40000
    case 'KRW':
      return 300000
    case 'VND':
      return 6000000
    default:
      return ceil(minAmount * 10)
  }
}

export function useDefaultsFromURLSearch(account: string | undefined) {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)
  const { chainId } = useActiveChainId()
  const { address } = useAccount()
  const { query, isReady } = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady || !chainId) return
      const parsed = await queryParametersToBuyCryptoState(query, account, chainId)

      dispatch(
        replaceBuyCryptoState({
          typedValue: '150',
          inputCurrencyId: parsed[Field.OUTPUT].currencyId,
          outputCurrencyId: parsed[Field.INPUT].currencyId,
          recipient: undefined,
        }),
      )
    }
    fetchData()
  }, [dispatch, query, isReady, account, chainId, address])
}
