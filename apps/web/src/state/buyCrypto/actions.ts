import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('buyCrypto/selectCurrency')
export const typeInput = createAction<{ typedValue: string }>('buyCrypto/typeInputBuyCrypto')
export const resetBuyCryptoState = createAction<void>('buyCrypto/resetbuyCryptoState')
export const setRecipient = createAction<{ recipient: string | undefined }>('buyCrypto/setRecipient')
export const setMinAmount = createAction<{
  minAmount: number
  minBaseAmount: number
  maxAmount: number
  maxBaseAmount: number
}>('buyCrypto/setMinAmount')
export const setUsersIpAddress = createAction<{ ip: string | undefined }>('buyCrypto/setUsersIpAddress')
export const replaceBuyCryptoState = createAction<{
  typedValue: string
  inputCurrencyId?: string | undefined
  outputCurrencyId?: string | undefined
  recipient: string | undefined
  minAmount?: number | undefined
  minBaseAmount?: number | undefined
  maxAmount?: number | undefined
  maxBaseAmount?: number | undefined
  userIpAddress?: string | undefined
}>('swap/replaceBuyCryptoState')
