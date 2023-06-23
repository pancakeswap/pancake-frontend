import { useCallback, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { BinanceConnectQuote, BscQuote, MercuryoQuote, PriceQuotes } from '../types'
import { fetchMercuryoQuote } from './useProviderQuotes'
import { fetchMercuryoAvailability, fetchMoonpayAvailability } from './useProviderAvailability'
import { MOONPAY_UNSUPPORTED_CURRENCY_CODES } from '../constants'

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
  Mercuryo: boolean
  BinanceConnect: boolean
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
  const { chainId } = useActiveChainId()

  const fetchProviderAvailability = async (ip: string, combinedData: ProviderQoute[]) => {
    // first check user availability
    const responsePromises = [fetchMoonpayAvailability(ip), fetchMercuryoAvailability(ip)]
    const responses = await Promise.allSettled(responsePromises)

    const dataPromises = responses.reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        return [...accumulator, response.value]
      }
      console.error('Error fetching price quotes:', response.reason)
      return accumulator
    }, [])

    const [moonPayAvailability, mercuryoAvailability] = await Promise.all(dataPromises)

    const ProviderAvailability: ProviderAvailabilityData = {
      MoonPay: moonPayAvailability?.result.result.isAllowed ?? false,
      Mercuryo: mercuryoAvailability?.result.result.data?.country.enabled ?? false,
      BinanceConnect: true,
    }
    const sortedFilteredQuotes = combinedData.filter((quote: ProviderQoute) => {
      return ProviderAvailability[quote.provider]
    })

    if (sortedFilteredQuotes.length > 1)
      sortedFilteredQuotes.sort((a: ProviderQoute, b: ProviderQoute) => {
        const totalAmountA = a.amount + a.providerFee + a.networkFee
        const totalAmountB = b.amount + b.providerFee + b.networkFee

        if (a.amount === 0 && b.amount === 0) return 0
        if (a.amount === 0) return 1
        if (b.amount === 0) return -1

        return totalAmountA - totalAmountB
      })

    return sortedFilteredQuotes
  }

  const fetchQuotes = useCallback(async () => {
    if (!chainId || !userIp) return
    try {
      const responsePromises = [
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
          const isMoonapySupported = MOONPAY_UNSUPPORTED_CURRENCY_CODES.includes(inputCurrency) || chainId === 56

          if (quote?.accountId && !isMoonapySupported) return calculateQuotesData(quote as PriceQuotes)
          if (quote?.code === '000000000') return calculateQuotesDataBsc(quote.data as BscQuote)
          if (quote?.status === 200) return calculateQuotesDataMercury(quote as MercuryoQuote, outputCurrency)
          return calculateNoQuoteOption(quote)
        })
        .filter((item) => typeof item !== 'undefined')

      const sortedFilteredQuotes = await fetchProviderAvailability(userIp, combinedData)
      setQuotes(sortedFilteredQuotes)
    } catch (error) {
      console.error('Error fetching price quotes:', error)
      setQuotes([])
    }
  }, [amount, inputCurrency, outputCurrency, chainId, userIp])

  return { quotes, fetchQuotes, fetchProviderAvailability }
}

export default usePriceQuotes
