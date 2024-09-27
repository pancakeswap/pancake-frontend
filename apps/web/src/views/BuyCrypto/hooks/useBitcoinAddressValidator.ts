import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import qs from 'qs'
import { createQueryKey, type Evaluate, type UseQueryParameters } from 'utils/reactQuery'

export enum BtcNetwork {
  mainnet = 'mainnet',
  testnet = 'testnet',
  regtest = 'regtest',
}

export const GetBtcValidationQueryKey = createQueryKey<
  'onramp-limits',
  [GetBtcValidationParameters & { network: keyof typeof BtcNetwork | undefined }]
>('onramp-limits')

type GetBtcValidationQueryKey = ReturnType<typeof GetBtcValidationQueryKey>

export type GetBtcAddrValidationReturnType = { code: number; result: boolean; error: boolean }

export type GetBtcValidationParameters = {
  address: string | undefined
}

export type useBtcAddressValidatorParameters<selectData = GetBtcAddrValidationReturnType> = Evaluate<
  GetBtcValidationParameters &
    UseQueryParameters<Evaluate<GetBtcAddrValidationReturnType>, Error, selectData, GetBtcValidationQueryKey>
>

export type useBtcAddressValidatorReturnType<selectData = GetBtcAddrValidationReturnType> = UseQueryResult<
  selectData,
  Error
>

export const useBtcAddressValidator = <selectData = GetBtcAddrValidationReturnType>(
  parameters: useBtcAddressValidatorParameters<selectData>,
): useBtcAddressValidatorReturnType<selectData> => {
  const { address, ...query } = parameters

  const enabled = Boolean(address && address !== '')
  const network = BtcNetwork.mainnet

  return useQuery({
    ...query,
    queryKey: GetBtcValidationQueryKey([
      {
        address,
        network,
      },
    ]),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { address, network } = queryKey[1]

      if (!address || !network) {
        throw new Error('Invalid parameters')
      }
      const btcValidationResponse = await fetchBtcAddressValidationRes({
        address,
        network,
      })
      return btcValidationResponse
    },
    ...query,
    enabled,
  })
}

async function fetchBtcAddressValidationRes(
  payload: GetBtcValidationParameters & { network: keyof typeof BtcNetwork | undefined },
): Promise<GetBtcAddrValidationReturnType> {
  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/validate/validate-btc-address?${qs.stringify({
      ...payload,
    })}`,
  )
  const result = await response.json()
  return result.result
}
