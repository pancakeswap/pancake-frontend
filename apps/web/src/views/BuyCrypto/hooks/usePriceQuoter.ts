import { useCallback, useEffect, useMemo, useState } from 'react'
import { MercuryoQuote, PriceQuotes } from '../types'

const MoonPay = `https://api.moonpay.com/v3/currencies/eth/buy_quote/?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54&baseCurrencyAmount=33&&baseCurrencyCode=usd`
const mercuryo = `https://api.mercuryo.io/v1.6/widget/buy/rate?from=USD&to=ETH&amount=33&network=ETHEREUM&widget_id=67710925-8b40-4767-846e-3b88db69f04d`
const BinanceConnect = `/bapi/fiat/v1/public/open-api/connect/get-quote`

export type ProviderQoute = {
  baseCurrency: string
  quoteCurrency: string
  providerFee: number
  networkFee: number
  totalFee: number
  amount: number
  quote: number
  provider: string
}

const calculateQuotesData = (quote: PriceQuotes): ProviderQoute => {
  return {
    baseCurrency: quote.baseCurrency.code,
    quoteCurrency: quote.currency.code,
    providerFee: quote.feeAmount,
    networkFee: quote.networkFeeAmount,
    totalFee: quote.quoteCurrencyAmount,
    amount: quote.quoteCurrencyAmount,
    quote: quote.quoteCurrencyPrice,
    provider: 'MoonPay',
  }
}

const calculateQuotesDataMercury = (quote: MercuryoQuote): ProviderQoute => {
  return {
    baseCurrency: quote.data.fiat_currency,
    quoteCurrency: quote.data.buy_token,
    providerFee: Number(quote.data.fee.ETH),
    networkFee: Number(quote.data.fee.ETH),
    totalFee: Number(quote.data.fee.ETH),
    amount: Number(quote.data.amount),
    quote: Number(quote.data.total.ETH),
    provider: 'BinanceConnect',
  }
}

const usePriceQuotes = (amount: string, inputCurrency: string, outputCurrency: string) => {
  const [quotes, setQuotes] = useState<PriceQuotes[] | MercuryoQuote[]>([])

  const fetchQuotes = useCallback(async () => {
    try {
      const responsePromises = [fetch(MoonPay), fetch(mercuryo)]
      const responses = await Promise.allSettled(responsePromises)

      const data = responses.reduce((accumulator, response) => {
        if (response.status === 'fulfilled') {
          return [...accumulator, response.value.json()]
        }
        console.error('Error fetching price quotes:', response.reason)
        return accumulator
      }, [])

      const quoteData = (await Promise.all(data)) as PriceQuotes[]
      setQuotes(quoteData)
    } catch (error) {
      console.error('Error fetching price quotes:', error)
    }
  }, [])

  const combinedQuotes = useMemo(() => {
    return quotes.map((quote) => {
      if (quote.data) {
        return calculateQuotesDataMercury(quote)
      }
      return calculateQuotesData(quote)
    })
  }, [quotes])

  return { quotes, fetchQuotes, combinedQuotes }
}

export default usePriceQuotes
