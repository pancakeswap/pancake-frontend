import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { ONRAMP_PROVIDERS, getNetworkDisplay } from '../constants'
import {
  createQueryKey,
  type Evaluate,
  type ExactPartial,
  type OnRampProviderQuote,
  type OnRampQuotesPayload,
  type UseQueryParameters,
} from '../types'

const getOnRampQuotesQueryKey = createQueryKey<'fetch-onramp-quotes', [ExactPartial<OnRampQuotesPayload>]>(
  'fetch-onramp-quotes',
)

type GetOnRampQuotesQueryKey = ReturnType<typeof getOnRampQuotesQueryKey>

type GetOnRampQuoteReturnType = { quotes: OnRampProviderQuote[]; quotesError: string | undefined }

export type UseOnRampQuotesReturnType<selectData = GetOnRampQuoteReturnType> = UseQueryResult<selectData, Error>

export type UseOnRampQuotesParameters<selectData = GetOnRampQuoteReturnType> = Evaluate<
  OnRampQuotesPayload &
    UseQueryParameters<Evaluate<GetOnRampQuoteReturnType>, Error, selectData, GetOnRampQuotesQueryKey>
>

export const useOnRampQuotes = <selectData = GetOnRampQuoteReturnType>(
  parameters: UseOnRampQuotesParameters<selectData>,
) => {
  const { fiatAmount, enabled, cryptoCurrency, fiatCurrency, network, ...query } = parameters

  return useQuery({
    ...query,
    queryKey: getOnRampQuotesQueryKey([
      {
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
      },
    ]),
    refetchInterval: 40 * 1_000,
    staleTime: 40 * 1_000,
    enabled: Boolean(enabled),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { cryptoCurrency, fiatAmount, fiatCurrency, network } = queryKey[1]
      if (!cryptoCurrency || !fiatAmount || !fiatCurrency) {
        throw new Error('Missing params')
      }
      const providerQuotes = await fetchProviderQuotes({
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
      })
      const quotes = providerQuotes.filter((q) => Boolean(q.quote !== 0)).sort((a, b) => b.quote - a.quote)

      const networkDisplay = getNetworkDisplay(network)
      const error =
        providerQuotes.length === 0 ? `No quotes available for ${cryptoCurrency} on ${networkDisplay}` : undefined
      return { quotes, quotesError: error }
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
