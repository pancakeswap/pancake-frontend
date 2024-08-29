import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect } from 'react'
import { buyCryptoReducerAtom, type BuyCryptoState } from 'state/buyCrypto/reducer'

import {
  OnRampChainId as ChainId,
  onRampCurrenciesMap,
  type OnRampCurrency as Currency,
} from 'views/BuyCrypto/constants'
import { Field, replaceBuyCryptoState, selectCurrency, switchCurrencies, typeInput } from './actions'

const useEnableBtcPurchases = atomWithStorage<boolean>('pcs:enable-buy-btc-native', false)

export function useAllowBtcPurchases() {
  return useAtom(useEnableBtcPurchases)
}

export function useBuyCryptoState() {
  return useAtomValue(buyCryptoReducerAtom)
}

function parseTokenAmountURLParameter(urlParam: unknown): string {
  return typeof urlParam === 'string' && !Number.isNaN(Number.parseFloat(urlParam)) ? urlParam : ''
}

export function useBuyCryptoActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string | number) => void
} {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency?.decimals ? `${currency.symbol}_${currency.chainId}` : currency.symbol,
        }),
      )
    },
    [dispatch],
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string | number) => {
      dispatch(typeInput({ field, typedValue: typedValue.toString() }))
    },
    [dispatch],
  )

  return {
    onCurrencySelection,
    onSwitchTokens,
    onUserInput,
  }
}

export async function queryParametersToBuyCryptoState(
  parsedQs: ParsedUrlQuery,
  chainId: ChainId,
): Promise<BuyCryptoState> {
  const parsedChainId = parsedQs.outputCurrency ? (parsedQs.outputCurrency as string).split('_')[1] : undefined

  const DEFAULT_FIAT_CURRENCY = [ChainId.BASE, ChainId.LINEA].find((c) => {
    if (parsedChainId) {
      return c.valueOf() === parseInt(parsedQs.chainId as string)
    }
    return c === chainId
  })
    ? 'EUR'
    : 'USD'

  let outputCurrencyId
  if (parsedQs.outputCurrency) {
    const parsedKey = parsedChainId ? (parsedQs.outputCurrency as string) : `${parsedQs.outputCurrency}_${chainId}`
    if (onRampCurrenciesMap[parsedKey]) {
      outputCurrencyId = parsedKey
    } else {
      const defaultChainCurrency = Object.keys(onRampCurrenciesMap).find(([key]) => {
        const [, id] = key.split('_')
        return parseInt(id) === (parsedChainId ?? chainId)
      })
      if (defaultChainCurrency) {
        outputCurrencyId = defaultChainCurrency
      }
    }
  }

  return {
    [Field.INPUT]: {
      currencyId: DEFAULT_FIAT_CURRENCY,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrencyId ?? 'CAKE_56',
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: Field.INPUT,
  }
}

export function useDefaultsFromURLSearch() {
  const [, dispatch] = useAtom(buyCryptoReducerAtom)
  const { chainId } = useActiveChainId()
  const { query, isReady } = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady || !chainId) return
      const parsed = await queryParametersToBuyCryptoState(query, chainId)

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
  }, [dispatch, query, isReady, chainId])
}
