import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import qs from 'qs'
import { useAccount } from 'wagmi'
import { ONRAMP_PROVIDERS, combinedNetworkIdMap, getIsNetworkEnabled, type OnRampChainId } from '../constants'
import {
  createQueryKey,
  type Evaluate,
  type ExactPartial,
  type OnRampProviderQuote,
  type OnRampUnit,
  type UseQueryParameters,
} from '../types'

export const getOnRampSignatureQueryKey = createQueryKey<
  'fetch-provider-signature',
  [ExactPartial<GetOnRampSignaturePayload>]
>('fetch-provider-signature')

type GetOnRampSignatureQueryKey = ReturnType<typeof getOnRampSignatureQueryKey>

export type GetOnRampSignatureReturnType = { signature: string }

export type GetOnRampSignaturePayload = {
  quote: OnRampProviderQuote | undefined
  walletAddress: string
  chainId: OnRampChainId | undefined
  externalTransactionId: string | undefined
  onRampUnit: OnRampUnit
}
export type UseOnRampSignatureReturnType<selectData = GetOnRampSignatureReturnType> = UseQueryResult<selectData, Error>

export type UseOnRampSignatureParameters<selectData = GetOnRampSignatureReturnType> = Evaluate<
  GetOnRampSignaturePayload &
    UseQueryParameters<Evaluate<GetOnRampSignatureReturnType>, Error, selectData, GetOnRampSignatureQueryKey>
>

export const useOnRampSignature = <selectData = GetOnRampSignatureReturnType>(
  parameters: Omit<UseOnRampSignatureParameters<selectData>, 'walletAddress' | 'redirectUrl'> & { btcAddress?: string },
): UseOnRampSignatureReturnType<selectData> => {
  const { address } = useAccount()
  const { quote, externalTransactionId, chainId, btcAddress, onRampUnit, ...query } = parameters

  const walletAddress = chainId === 0 ? btcAddress : address
  return useQuery({
    ...query,
    queryKey: getOnRampSignatureQueryKey([
      {
        chainId,
        quote,
        walletAddress,
        externalTransactionId,
        onRampUnit,
      },
    ]),
    enabled: Boolean(externalTransactionId && quote && walletAddress && getIsNetworkEnabled(chainId)),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { quote, externalTransactionId, chainId, onRampUnit } = queryKey[1]

      if (!quote || !walletAddress || !externalTransactionId || !chainId || !onRampUnit) {
        throw new Error('Invalid parameters')
      }

      const { provider, cryptoCurrency, fiatCurrency, amount } = quote
      const network = combinedNetworkIdMap[ONRAMP_PROVIDERS[provider]][chainId]
      const moonpayCryptoCurrency = `${cryptoCurrency.toLowerCase()}${network}`

      const response = await fetch(
        `${ONRAMP_API_BASE_URL}/fetch-provider-signature?${qs.stringify({
          cryptoCurrency: provider === 'MoonPay' ? moonpayCryptoCurrency : cryptoCurrency,
          provider,
          fiatCurrency,
          amount,
          network,
          walletAddress,
          externalTransactionId,
          onRampUnit,
        })}`,
      )
      const result: GetOnRampSignatureReturnType = await response.json()
      return result
    },
    ...query,
  })
}
