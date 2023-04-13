import { Currency, CurrencyAmount, Pair, TradeType } from '@pancakeswap/sdk'
import { string as zString, object as zObject, nativeEnum as zNativeEnum, number as zNumber } from 'zod'
import { MutableRefObject } from 'react'
import { Field } from '../../../state/swap/actions'

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
    // This should be the same rfqId that was sent by the server}
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

interface BasePair {
  token0: Currency
  token1: Currency
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
  involvesToken: (token: Currency) => boolean
}

interface BaseRoute<TInput extends Currency, TOutput extends Currency, TPair extends BasePair | Pair> {
  pairs: TPair[]
  input: TInput
  output: TOutput
  path: Currency[]
}

export interface TradeWithMM<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
  tradeType: TTradeType
  route: BaseRoute<TInput, TOutput, Pair>
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
}

export interface MMOrderBookTrade {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  trade?: TradeWithMM<Currency, Currency, TradeType> | null
  inputError?: string
  mmParam: OrderBookRequest
  rfqUserInputPath: MutableRefObject<string>
  isRFQLive: MutableRefObject<boolean>
  isLoading: boolean
}

export interface MMRfqTrade {
  rfq: RFQResponse['message'] | null
  trade: TradeWithMM<Currency, Currency, TradeType> | null
  refreshRFQ: () => void | null
  quoteExpiry: number | null
  isLoading: boolean
  error?: Error
  rfqId?: string
}
