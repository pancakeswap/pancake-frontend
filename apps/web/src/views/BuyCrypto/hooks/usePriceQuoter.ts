import { useCallback, useState } from 'react'
import { BinanceConnectQuote, BscQuote, MercuryoQuote, PriceQuotes } from '../types'
import { fetchBinanceConnectQuote, fetchMercuryoQuote, fetchMoonpayQuote } from './useProviderQuotes'
import {
  fetchBinanceConnectAvailability,
  fetchMercuryoAvailability,
  fetchMoonpayAvailability,
} from './useProviderAvailability'

export type ProviderQoute = {
  providerFee: number
  networkFee: number
  amount: number
  quote: number
  provider: string
}

type ProviderResponse = (Partial<MercuryoQuote> & Partial<PriceQuotes> & Partial<BinanceConnectQuote>) | undefined

export interface ProviderAvailabilityData {
  MoonPay: boolean
  BinanceConnect: boolean
  Mercuryo: boolean
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

const calculateNoQuoteOption = (quote: ProviderResponse): ProviderQoute => {
  let provider = 'MoonPay'
  if (quote?.code === 'OPE100000031') provider = 'BinanceConnect'
  else if (quote?.code === 'ERR_BAD_REQUEST') provider = 'Mercuryo'
  return {
    providerFee: 0,
    networkFee: 0,
    amount: 0,
    quote: 0,
    provider,
  }
}

const usePriceQuotes = (amount: string, inputCurrency: string, outputCurrency: string, userIp: string | null) => {
  const [quotes, setQuotes] = useState<ProviderQoute[]>([])

  const fetchProviderAvailability = async (ip: string, combinedData: ProviderQoute[]) => {
    // first check user availability
    const responsePromises = [
      fetchMoonpayAvailability(ip),
      fetchMercuryoAvailability(ip),
      fetchBinanceConnectAvailability(ip),
    ]
    const responses = await Promise.allSettled(responsePromises)

    const dataPromises = responses.reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        return [...accumulator, response.value.json()]
      }
      console.error('Error fetching price quotes:', response.reason)
      return accumulator
    }, [])

    const [moonPayAvailability, BinanceConnectAvailability, mercuryoAvailability] = await Promise.all(dataPromises)

    const ProviderAvailability: ProviderAvailabilityData = {
      MoonPay: moonPayAvailability?.isAllowed ?? false,
      Mercuryo: mercuryoAvailability?.data?.status === 'pass' ?? false,
      BinanceConnect: BinanceConnectAvailability?.data?.country?.enabled ?? false,
    }
    const sortedFilteredQuotes = combinedData.filter((quote: ProviderQoute) => {
      return ProviderAvailability[quote.provider]
    })
    if (combinedData.length > 1)
      combinedData.sort((a: ProviderQoute, b: ProviderQoute) => (a.amount < b.amount ? 1 : -1))

    return sortedFilteredQuotes
  }

  const fetchQuotes = useCallback(async () => {
    if (!userIp) return
    try {
      const responsePromises = [
        fetchMoonpayQuote(Number(amount), outputCurrency, inputCurrency),
        fetchBinanceConnectQuote({
          fiatCurrency: outputCurrency.toUpperCase(),
          cryptoCurrency: inputCurrency.toUpperCase() === 'WBTC' ? 'BTC' : inputCurrency.toUpperCase(),
          fiatAmount: amount,
          cryptoNetwork: 'BSC',
          paymentMethod: 'CARD',
        }),
        fetchMercuryoQuote({
          fiatCurrency: outputCurrency.toUpperCase(),
          cryptoCurrency: inputCurrency.toUpperCase(),
          fiatAmount: Number(amount).toString(),
        }),
      ]
      const responses = await Promise.allSettled(responsePromises)

      const dataPromises: ProviderResponse[] = responses
        .reduce((accumulator, response) => {
          if (response.status === 'fulfilled') {
            return [...accumulator, response.value]
          }
          console.error('Error fetching price quotes:', response.reason)
          return accumulator
        }, [])
        .filter((item) => typeof item !== 'undefined')

      const combinedData: ProviderQoute[] = dataPromises
        .map((quote: ProviderResponse) => {
          if (quote?.accountId) return calculateQuotesData(quote as PriceQuotes)
          if (quote?.code === '000000000') return calculateQuotesDataBsc(quote.data as BscQuote)
          if (quote?.status === 200) return calculateQuotesDataMercury(quote as MercuryoQuote, inputCurrency)
          return calculateNoQuoteOption(quote)
        })
        .filter((item) => typeof item !== 'undefined')

      // const sortedFilteredQuotes = await fetchProviderAvailability(userIp, combinedData)
      if (combinedData.length > 1)
        combinedData.sort((a: ProviderQoute, b: ProviderQoute) => (a.amount < b.amount ? 1 : -1))

      setQuotes(combinedData)
    } catch (error) {
      console.error('Error fetching price quotes:', error)
      setQuotes([])
    }
  }, [amount, inputCurrency, outputCurrency])

  return { quotes, fetchQuotes, fetchProviderAvailability }
}

export default usePriceQuotes
