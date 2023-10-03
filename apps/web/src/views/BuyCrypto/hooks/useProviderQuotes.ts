import {
  MERCURYO_WIDGET_ID,
  MOONPAY_API_KEY,
  MOONPAY_BASE_URL,
  ONRAMP_API_BASE_URL,
  TRANSAK_API_KEY,
} from 'config/constants/endpoints'
import toUpper from 'lodash/toUpper'
import toNumber from 'lodash/toNumber'
import { ONRAMP_PROVIDERS, chainIdToMoonPayNetworkId, combinedNetworkIdMap, supportedTokenMap } from '../constants'
import { ProviderQuote } from '../types'

export async function fetchProviderQuotes(payload): Promise<ProviderQuote[]> {
  // Fetch data from endpoint 1
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-quotes`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  return result.result
}

export const fetchLimitOfMer = async (inputCurrencyId: string, outputCurrencyId: string, chainId: number) => {
  if (!supportedTokenMap[chainId][ONRAMP_PROVIDERS.Mercuryo].includes(inputCurrencyId.toUpperCase())) return undefined
  try {
    const response = await fetch(
      `https://api.mercuryo.io/v1.6/widget/buy/rate?widget_id=${MERCURYO_WIDGET_ID}&type=buy&from=${toUpper(
        inputCurrencyId,
      )}&to=${toUpper(outputCurrencyId)}&amount=1`,
    )

    if (!response.ok) {
      throw new Error('Failed to fetch minimum buy amount')
    }

    const limitQuote = await response.json()

    if (limitQuote[toUpper(inputCurrencyId)] || limitQuote[toUpper(outputCurrencyId)]) {
      return undefined
    }

    return {
      baseCurrency: {
        code: inputCurrencyId.toLowerCase(),
        maxBuyAmount: toNumber(limitQuote[toUpper(inputCurrencyId)]?.max),
        minBuyAmount: toNumber(limitQuote[toUpper(inputCurrencyId)]?.min),
      },
      quoteCurrency: {
        code: outputCurrencyId.toUpperCase(),
        maxBuyAmount: toNumber(limitQuote[toUpper(outputCurrencyId)]?.max),
        minBuyAmount: toNumber(limitQuote[toUpper(outputCurrencyId)]?.min),
      },
    }
  } catch (error) {
    console.error('fetchLimitOfMer: ', error)
    return undefined
  }
}

export const fetchLimitOfMoonpay = async (inputCurrencyId: string, outputCurrencyId: string, chainId: number) => {
  if (!supportedTokenMap[chainId][ONRAMP_PROVIDERS.MoonPay].includes(inputCurrencyId.toUpperCase())) return undefined
  try {
    const baseCurrency = `${outputCurrencyId.toLowerCase()}${chainIdToMoonPayNetworkId[chainId]}`
    const response = await fetch(
      `${MOONPAY_BASE_URL}/v3/currencies/${baseCurrency}/limits?apiKey=${MOONPAY_API_KEY}&baseCurrencyCode=${inputCurrencyId.toLowerCase()}&areFeesIncluded=true`,
    )

    if (!response.ok) {
      return undefined
    }

    const moonpayLimitQuote = await response.json()

    if (!moonpayLimitQuote.baseCurrency || !moonpayLimitQuote.quoteCurrency) {
      return undefined
    }

    return moonpayLimitQuote
  } catch (error) {
    console.error('fetchLimitOfMoonpay: ', error)
    return undefined
  }
}

export const fetchLimitOfTransak = async (inputCurrencyId: string, outputCurrencyId: string, chainId: number) => {
  if (!supportedTokenMap[chainId][ONRAMP_PROVIDERS.Transak].includes(outputCurrencyId.toUpperCase())) return undefined
  try {
    const response = await fetch(
      `https://api-stg.transak.com/api/v1/pricing/public/limits/BUY?apiKey=${TRANSAK_API_KEY}`,
    )

    if (!response.ok) {
      return undefined
    }

    const defaultPaymentType = 'credit_debit_card'
    const transakLimitQuote = await response.json()
    const limitQuote =
      transakLimitQuote.response[`${outputCurrencyId}${combinedNetworkIdMap[ONRAMP_PROVIDERS.Transak][chainId]}`][
        inputCurrencyId
      ][defaultPaymentType]

    return {
      baseCurrency: {
        code: inputCurrencyId.toUpperCase(),
        maxBuyAmount: limitQuote.maxFiatAmount,
        minBuyAmount: limitQuote.minFiatAmount,
      },
      quoteCurrency: {
        code: outputCurrencyId.toUpperCase(),
        maxBuyAmount: limitQuote.maxCryptoAmount,
        minBuyAmount: limitQuote.minCryptoAmount,
      },
    }
  } catch (error) {
    console.error('fetchLimitOfMoonpay: ', error)
    return undefined
  }
}
