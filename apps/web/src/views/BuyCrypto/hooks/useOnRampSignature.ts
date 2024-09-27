import { useTheme } from '@pancakeswap/hooks'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import qs from 'qs'
import { createQueryKey, type Evaluate, type ExactPartial, type UseQueryParameters } from 'utils/reactQuery'
import { useAccount } from 'wagmi'
import { ONRAMP_PROVIDERS, WidgetTheme, combinedNetworkIdMap, type OnRampChainId } from '../constants'
import { type OnRampProviderQuote, type OnRampUnit } from '../types'

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
  theme?: WidgetTheme | undefined
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
  const { isDark } = useTheme()
  const { quote, externalTransactionId, chainId, btcAddress, onRampUnit, ...query } = parameters

  const walletAddress = chainId === 0 ? btcAddress : address
  const theme = isDark ? WidgetTheme.Dark : WidgetTheme.Light

  return useQuery({
    ...query,
    queryKey: getOnRampSignatureQueryKey([
      {
        chainId,
        quote,
        walletAddress,
        externalTransactionId,
        onRampUnit,
        theme,
      },
    ]),
    enabled: Boolean(externalTransactionId && quote && walletAddress && chainId?.toString() && onRampUnit),
    queryFn: async () => {
      if (!quote || !walletAddress || !externalTransactionId || chainId === undefined || !onRampUnit) {
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
          theme,
        })}`,
      )
      const result: GetOnRampSignatureReturnType = await response.json()
      return result
    },
    ...query,
  })
}
