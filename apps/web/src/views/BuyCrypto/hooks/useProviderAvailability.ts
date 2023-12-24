import { ONRAMP_PROVIDERS } from '../constants'

export async function fetchProviderAvailabilities(): Promise<{ [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }> {
  try {
    const response = await fetch(`/api/onramp/provider-availability`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()
    return result.result
  } catch (error) {
    console.error(error)
    return { MoonPay: true, Mercuryo: true, Transak: true }
  }
}
