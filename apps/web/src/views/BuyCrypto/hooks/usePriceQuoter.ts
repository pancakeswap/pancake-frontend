import { useCallback, useState } from 'react'
import { BinanceConnectQuote, BscQuote, MercuryoQuote, PriceQuotes } from '../types'
import { fetchBinanceConnectQuote, fetchMercuryoQuote, fetchMoonpayQuote } from './useProviderQuotes'

export type ProviderQoute = {
  providerFee: number
  networkFee: number
  amount: number
  quote: number
  provider: string
}

const calculateQuotesData = (quote: PriceQuotes): ProviderQoute => {
  return {
    providerFee: quote.feeAmount,
    networkFee: quote.networkFeeAmount,
    amount: quote.quoteCurrencyAmount,
    quote: quote.quoteCurrencyPrice,
    provider: 'MoonPay',
  }
}

const calculateQuotesDataMercury = (quote: MercuryoQuote, inputCurrency: string): ProviderQoute => {
  return {
    providerFee: Number(quote.data.fee[inputCurrency.toUpperCase()]),
    networkFee: 0,
    amount: Number(quote.data.amount),
    quote: Number(quote.data.rate),
    provider: 'Mercuryo',
  }
}

const calculateQuotesDataBsc = (quote: BscQuote): ProviderQoute => {
  return {
    providerFee: quote.userFee,
    networkFee: quote.networkFee,
    amount: quote.cryptoAmount,
    quote: quote.quotePrice,
    provider: 'BinanceConnect',
  }
}

const usePriceQuotes = (amount: string, inputCurrency: string, outputCurrency: string) => {
  const [quotes, setQuotes] = useState<ProviderQoute[]>([])

  const fetchQuotes = useCallback(async () => {
    try {
      const responsePromises = [
        fetchMoonpayQuote(Number(amount), outputCurrency, inputCurrency),
        fetchBinanceConnectQuote({
          fiatCurrency: outputCurrency.toUpperCase(),
          cryptoCurrency: inputCurrency.toUpperCase(),
          fiatAmount: amount,
          cryptoNetwork: 'BSC',
          paymentMethod: 'CARD',
        }),
        fetchMercuryoQuote(outputCurrency, inputCurrency, Number(amount)),
      ]
      const responses = await Promise.allSettled(responsePromises)

      const dataPromises = responses.reduce((accumulator, response) => {
        if (response.status === 'fulfilled') {
          return [...accumulator, response.value.json()]
        }
        console.error('Error fetching price quotes:', response.reason)
        return accumulator
      }, [])

      const [moonPayQuotes, BinanceConnectQuotes, mercuryoQuotes] = (await Promise.all(dataPromises)) as [
        PriceQuotes,
        BinanceConnectQuote,
        MercuryoQuote,
      ]

      const combinedData: ProviderQoute[] = []

      if (moonPayQuotes?.accountId) combinedData.push(calculateQuotesData(moonPayQuotes))
      if (BinanceConnectQuotes?.code === '000000000')
        combinedData.push(calculateQuotesDataBsc(BinanceConnectQuotes.data))
      if (mercuryoQuotes?.status === 200) combinedData.push(calculateQuotesDataMercury(mercuryoQuotes, inputCurrency))

      if (combinedData.length > 1)
        combinedData.sort((a: ProviderQoute, b: ProviderQoute) => (a.amount < b.amount ? 1 : -1))

      setQuotes(combinedData)
    } catch (error) {
      console.error('Error fetching price quotes:', error)
      setQuotes([])
    }
  }, [amount, inputCurrency, outputCurrency])

  return { quotes, fetchQuotes }
}

export default usePriceQuotes
