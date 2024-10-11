import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import type { Pool, Route } from '@pancakeswap/routing-sdk'
import type { PublicClient } from 'viem'

export type QuoteRoute<P extends Pool = Pool> = Pick<Route<P>, 'path' | 'pools'> & {
  amount: CurrencyAmount<Currency>
}

export type FetchQuoteParams<P extends Pool = Pool> = {
  client: PublicClient
  route: QuoteRoute<P>
}

export type FetchQuotesParams<P extends Pool = Pool> = {
  client: PublicClient
  routes: QuoteRoute<P>[]
}

export type Quote = {
  quote: CurrencyAmount<Currency>
  gasUseEstimate: bigint
}

export type FetchQuote<P extends Pool = Pool> = (params: FetchQuoteParams<P>) => Promise<Quote | undefined>

export type FetchQuotes<P extends Pool = Pool> = (params: FetchQuotesParams<P>) => Promise<(Quote | undefined)[]>
