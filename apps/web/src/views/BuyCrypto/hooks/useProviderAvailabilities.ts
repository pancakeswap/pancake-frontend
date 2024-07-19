import { useQuery } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import type { ONRAMP_PROVIDERS } from '../constants'

export type ProviderAvailabilities = { [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }

export interface ProviderAvailabilititProps {
  providerAvailabilities: ProviderAvailabilities
}

export const useProviderAvailabilities = () => {
  return useQuery({
    queryKey: ['providerAvailabilities'],
    queryFn: async () => {
      const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      return result.result as ProviderAvailabilities
    },
    initialData: {
      MoonPay: true,
      Mercuryo: true,
      Transak: true,
      Topper: true,
    },
  })
}
