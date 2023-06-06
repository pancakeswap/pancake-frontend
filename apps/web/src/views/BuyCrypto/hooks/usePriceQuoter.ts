import { useCallback, useEffect, useMemo, useState } from 'react'
import { PriceQuotes } from '../types'

const MoonPay = `https://api.moonpay.com/v3/currencies/btc/buy_quote/?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54&baseCurrencyAmount=50&&baseCurrencyCode=usd`
const mercuryo = `https://api.mercuryo.io/v1.6/widget/buy/rate?from=EUR&to=USDT&amount=500&network=TRON&widget_id=67710925-8b40-4767-846e-3b88db69f04d`
const BinanceConnect = `/bapi/fiat/v1/public/open-api/connect/get-quote`

export type ProviderQoute = {
  baseCurrency: string
  quoteCurrency: string
  providerFee: number
  networkFee: number
  totalFee: number
}

const calculateQuotesData = (quote: PriceQuotes): ProviderQoute => {
  return {
    baseCurrency: quote.baseCurrency.code,
    quoteCurrency: quote.currency.code,
    providerFee: quote.feeAmount,
    networkFee: quote.networkFeeAmount,
    totalFee: quote.quoteCurrencyAmount,
  }
}

const usePriceQuotes = (amount: string, inputCurrency: string, outputCurrency: string) => {
  const [quotes, setQuotes] = useState<PriceQuotes[]>([])

  const fetchQuotes = useCallback(async () => {
    try {
      const responsePromises = [fetch(MoonPay), fetch(MoonPay), fetch(mercuryo)]
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
    const [moonPayQuote1, moonPayQuote2] = quotes
    if (moonPayQuote1 && moonPayQuote2) {
      return [calculateQuotesData(moonPayQuote1), calculateQuotesData(moonPayQuote2)]
    }

    return []
  }, [quotes])

  return { quotes, fetchQuotes, combinedQuotes }
}

export default usePriceQuotes
