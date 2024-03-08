import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import ceil from 'lodash/ceil'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect } from 'react'
import { BuyCryptoState, buyCryptoReducerAtom } from 'state/buyCrypto/reducer'
import { OnRampChainId as ChainId, OnRampCurrency as Currency } from 'views/BuyCrypto/constants'
import { useAccount } from 'wagmi'
import { Field, replaceBuyCryptoState, selectCurrency, typeInput } from './actions'

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
} {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      if (typedValue === '' || allowTwoDecimalRegex.test(typedValue)) {
        dispatch(typeInput({ typedValue }))
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

  return {
    onFieldAInput,
    onCurrencySelection,
  }
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
          typedValue: '',
          inputCurrencyId: parsed[Field.OUTPUT].currencyId,
          outputCurrencyId: parsed[Field.INPUT].currencyId,
          recipient: undefined,
        }),
      )
    }
    fetchData()
  }, [dispatch, query, isReady, account, chainId, address])
}
