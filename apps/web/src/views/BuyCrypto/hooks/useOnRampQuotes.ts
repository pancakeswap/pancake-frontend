import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS } from '../constants'
import {
  createQueryKey,
  type Evaluate,
  type ExactPartial,
  type OnRampProviderQuote,
  type OnRampQuotesPayload,
  type UseQueryParameters,
} from '../types'
import type { ProviderAvailabilities } from './useProviderAvailabilities'

const getOnRampQuotesQueryKey = createQueryKey<'fetch-onramp-quotes', [ExactPartial<OnRampQuotesPayload>]>(
  'fetch-onramp-quotes',
)

type GetOnRampQuotesQueryKey = ReturnType<typeof getOnRampQuotesQueryKey>

type GetOnRampQuoteReturnType = OnRampProviderQuote[]

export type UseOnRampQuotesReturnType<selectData = GetOnRampQuoteReturnType> = UseQueryResult<selectData, Error>

export type UseOnRampQuotesParameters<selectData = GetOnRampQuoteReturnType> = Evaluate<
  OnRampQuotesPayload &
    UseQueryParameters<Evaluate<GetOnRampQuoteReturnType>, Error, selectData, GetOnRampQuotesQueryKey>
>

export const useOnRampQuotes = <selectData = GetOnRampQuoteReturnType>(
  parameters: UseOnRampQuotesParameters<selectData> & { providerAvailabilities: ProviderAvailabilities },
) => {
  const { fiatAmount, enabled, cryptoCurrency, fiatCurrency, network, providerAvailabilities, isFiat, ...query } =
    parameters

  return useQuery({
    ...query,
    queryKey: getOnRampQuotesQueryKey([
      {
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
        isFiat,
      },
    ]),
    refetchInterval: 40 * 1_000,
    staleTime: 40 * 1_000,
    enabled: Boolean(enabled),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { cryptoCurrency, fiatAmount, fiatCurrency, network, isFiat } = queryKey[1]
      if (!cryptoCurrency || !fiatAmount || !fiatCurrency || !isFiat) {
        throw new Error('Missing params')
      }
      const providerQuotes = await fetchProviderQuotes({
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
        isFiat,
      })
      const sortedFilteredQuotes = providerQuotes
        .filter((quote) => providerAvailabilities[quote.provider])
        .sort((a, b) => b.quote - a.quote)

      return sortedFilteredQuotes
    },
  })
}

async function fetchProviderQuotes(payload: OnRampQuotesPayload): Promise<OnRampProviderQuote[]> {
  const response = await fetch(
    // TO UPDATE
    `${ONRAMP_API_BASE_URL}/fetch-provider-quotes`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
  const result = await response.json()
  return result.result
}

export async function fetchProviderAvailabilities(): Promise<{ [provider in keyof typeof ONRAMP_PROVIDERS]: boolean }> {
  // Fetch data from endpoint 1
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const result = await response.json()
  return result.result
}
