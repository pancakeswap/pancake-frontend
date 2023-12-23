import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS } from '../constants'

export async function fetchProviderAvailabilities(
  payload,
): Promise<{ [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }> {
  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability-get?userIp=${payload.userIp}`, {
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

export async function fetchUserIp(): Promise<string | undefined> {
  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/user-ip`)
    const result = await response.json()
    return result.ipAddress
  } catch (error) {
    console.error(error)
    return undefined
  }
}
