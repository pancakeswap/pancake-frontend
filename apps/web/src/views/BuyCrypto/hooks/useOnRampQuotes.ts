import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { createQueryKey, type Evaluate, type ExactPartial, type UseQueryParameters } from 'utils/reactQuery'
import { type OnRampProviderQuote, type OnRampQuotesPayload } from '../types'

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
  parameters: UseOnRampQuotesParameters<selectData>,
) => {
  const { fiatAmount, enabled, cryptoCurrency, fiatCurrency, network, onRampUnit, providerAvailabilities, ...query } =
    parameters
  return useQuery({
    ...query,
    queryKey: getOnRampQuotesQueryKey([
      {
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
        onRampUnit,
      },
    ]),
    refetchInterval: 40 * 1_000,
    staleTime: 40 * 1_000,
    enabled: Boolean(enabled),
    queryFn: async () => {
      if (!cryptoCurrency || !fiatAmount || !fiatCurrency || !onRampUnit) {
        throw new Error('Missing buy-crypto fetch-provider-quotes params')
      }
      const quotes = await fetchProviderQuotes({
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network,
        onRampUnit,
      })

      if (quotes.length === 0) throw new Error('No quotes available')

      return quotes.filter((q) => providerAvailabilities[q.provider])
    },
  })
}

async function fetchProviderQuotes(
  payload: Omit<OnRampQuotesPayload, 'providerAvailabilities'>,
): Promise<OnRampProviderQuote[]> {
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
