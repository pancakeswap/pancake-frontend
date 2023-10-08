import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS, chainIdToMoonPayNetworkId, combinedNetworkIdMap } from '../constants'

interface FetchResponse {
  urlWithSignature: string
}

export const fetchMoonPaySignedUrl = async (
  inputCurrency: string,
  outputCurrency: string,
  amount: string,
  isDark: boolean,
  account: `0x${string}`,
  chainId: number | undefined,
) => {
  if (!chainId) return ''
  try {
    const baseCurrency = `${inputCurrency.toLowerCase()}${chainIdToMoonPayNetworkId[chainId]}`

    const res = await fetch(`${ONRAMP_API_BASE_URL}/generate-moonpay-sig`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'MOONPAY',
        defaultCurrencyCode: baseCurrency,
        baseCurrencyCode: outputCurrency.toLowerCase(),
        baseCurrencyAmount: amount,
        redirectUrl: 'https://pancakeswap.finance',
        theme: isDark ? 'dark' : 'light',
        walletAddress: account,
        isTestEnv: 'production',
      }),
    })
    const result: FetchResponse = await res.json()

    return result.urlWithSignature
  } catch (error) {
    console.error('Error fetching signature:', error)
    return '' // Return an empty string in case of an error
  }
}

export const fetchTransakSignedUrl = async (
  inputCurrency: string,
  outputCurrency: string,
  amount: string,
  account: `0x${string}`,
  chainId: number | undefined,
) => {
  if (!chainId) return ''
  try {
    const res = await fetch(`${ONRAMP_API_BASE_URL}/generate-transak-sig`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        fiatCurrency: outputCurrency.toUpperCase(),
        cryptoCurrency: inputCurrency.toUpperCase(),
        amount,
        network: combinedNetworkIdMap[ONRAMP_PROVIDERS.Transak][chainId],
        walletAddress: account,
      }),
    })
    const result: FetchResponse = await res.json()

    return result.urlWithSignature
  } catch (error) {
    console.error('Error fetching signature:', error)
    return '' // Return an empty string in case of an error
  }
}

export const fetchMercuryoSignedUrl = async (account: `0x${string}`) => {
  try {
    const res = await fetch(`${ONRAMP_API_BASE_URL}/generate-mercuryo-sig?walletAddress=${account}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const signature = await res.json()

    return signature.signature
  } catch (error) {
    console.error('Error fetching signature:', error)
    return '' // Return an empty string in case of an error
  }
}
