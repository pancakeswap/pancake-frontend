import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { MutableRefObject } from 'react'
import { Field } from 'state/swap/actions'
import { nativeEnum as zNativeEnum, number as zNumber, object as zObject, string as zString } from 'zod'

export enum MessageType {
  RFQ_REQUEST = 'RFQ_REQUEST',
  RFQ_RESPONSE = 'RFQ_RESPONSE',
  ORDER_BOOK_PRICE_RESPONSE = 'ORDER_BOOK_PRICE_RESPONSE',
  RFQ_SUCCESS = 'RFQ_SUCCESS',
  RFQ_ERROR = 'RFQ_ERROR',
}

export const zRFQResponse = zObject({
  messageType: zNativeEnum(MessageType),
  message: zObject({
    makerSideToken: zString(),
    takerSideToken: zString(),
    makerSideTokenAmount: zString(),
    takerSideTokenAmount: zString(),
    rfqId: zString(),
    mmId: zString().optional(),
    signature: zString(),
    quoteExpiry: zNumber(),
  }),
})

export interface RFQResponse {
  messageType: MessageType.RFQ_RESPONSE
  message: {
    // Same as RFQ
    makerSideToken: string
    takerSideToken: string

    // Amounts are in decimals.
    makerSideTokenAmount: string
    takerSideTokenAmount: string
    // This should be the same rfqId that was sent by the server
    rfqId: string

    // This will be set by server
    mmId?: string
    signature: string
    // The unix timestamp when the quote expires, in seconds.
    quoteExpiry: number
    nonce: string
    trader: string
  }
}

export interface RFQErrorResponse {
  message: {
    error: string
    rfqId: string
  }
  messageType: MessageType.RFQ_ERROR
}

export type OrderBookRequest = {
  networkId: number
  makerSideToken: string
  takerSideToken: string
  makerSideTokenAmount?: string
  takerSideTokenAmount?: string
  trader: string
}

export interface OrderBookResponse {
  messageType: MessageType.ORDER_BOOK_PRICE_RESPONSE
  message: {
    error?: string
    makerSideToken: string
    takerSideToken: string
    makerSideTokenAmount: string
    takerSideTokenAmount: string
  }
}

export type QuoteRequest = OrderBookRequest

export type RFQIdResponse = {
  messageType: MessageType.RFQ_SUCCESS
  message: {
    rfqId: string
  }
}

export interface MMOrderBookTrade<T> {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  trade?: T | null
  inputError?: string
  mmParam: OrderBookRequest | null
  rfqUserInputPath: MutableRefObject<string>
  isRFQLive: MutableRefObject<boolean>
  isLoading: boolean
}

export interface MMRfqTrade<T> {
  rfq: RFQResponse['message'] | null | undefined
  trade: T | null
  refreshRFQ: (() => void) | null
  quoteExpiry: number | null
  isLoading: boolean
  error?: Error
  rfqId?: string
}
