import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('buyCrypto/selectCurrency')
export const typeInput = createAction<{ typedValue: string }>('buyCrypto/typeInputBuyCrypto')
export const resetBuyCryptoState = createAction<void>('buyCrypto/resetbuyCryptoState')
export const setRecipient = createAction<{ recipient: string | null }>('buyCrypto/setRecipient')
export const setMinAmount = createAction<{ minAmount: string; minBaseAmount: string }>('buyCrypto/setMinAmount')
export const setUsersIpAddress = createAction<{ ip: string | null }>('buyCrypto/setUsersIpAddress')
export const replaceBuyCryptoState = createAction<{
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  minAmount?: string | null
  minBaseAmount?: string | null
  userIpAddress?: string | null
}>('swap/replaceBuyCryptoState')
