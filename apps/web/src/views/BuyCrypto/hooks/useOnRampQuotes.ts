import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import {
  createQueryKey,
  Evaluate,
  ExactPartial,
  OnRampProviderQuote,
  OnRampQuotesPayload,
  UseQueryParameters,
} from '../types'

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
  const { fiatAmount, enabled, cryptoCurrency, fiatCurrency, network, ...query } = parameters
  console.log(network)
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
    enabled: Boolean(cryptoCurrency && fiatAmount && fiatCurrency && network && enabled),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { cryptoCurrency, fiatAmount, fiatCurrency, network } = queryKey[1]
      if (!cryptoCurrency || !fiatAmount || !fiatCurrency || !network) {
        throw new Error('Missing params')
      }
      const providerQuotes = await fetchProviderQuotes({
        cryptoCurrency,
        fiatAmount,
        fiatCurrency,
        network: network === 'bitcoin' ? 0 : network,
      })
      const sortedFilteredQuotes = providerQuotes.sort((a, b) => b.quote - a.quote)

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
