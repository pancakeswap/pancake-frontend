import { MOONPAY_API_KEY, MOONPAY_BASE_URL, ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ProviderQoute } from '../types'

export async function fetchMoonpayQuote(baseAmount: number, currencyCode: string, outputCurrency: string) {
  // Fetch data from endpoint 1
  const response = await fetch(
    `${MOONPAY_BASE_URL}/v3/currencies/${outputCurrency.toLowerCase()}/buy_quote/?apiKey=${MOONPAY_API_KEY}&baseCurrencyAmount=${baseAmount}&&baseCurrencyCode=${currencyCode.toLowerCase()}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  const result = response.json()
  return result
}

export async function fetchProviderQuotes(payload): Promise<ProviderQoute[]> {
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

export async function fetchMercuryoQuote(payload: any) {
  // Fetch data from endpoint 2
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-mercuryo-quote`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  return result.result.result
}
