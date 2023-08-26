import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS } from '../constants'

// will cleanup urls later
export async function fetchMoonpayAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 1
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-moonpay-availability?userIp=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = response.json()
  return result
}

export async function fetchMercuryoAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 2
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-mercuryo-availability?userIp=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = response.json()
  return result
}

export async function fetchProviderAvailabilities(
  payload,
): Promise<{ [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }> {
  // Fetch data from endpoint 1
  const response = await fetch(`http://localhost:8081/fetch-provider-availability`, {
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
