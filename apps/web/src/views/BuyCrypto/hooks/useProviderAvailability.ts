import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS } from '../constants'

export async function fetchProviderAvailabilities(
  payload,
): Promise<{ [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }> {
  // Fetch data from endpoint 1
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability`, {
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
