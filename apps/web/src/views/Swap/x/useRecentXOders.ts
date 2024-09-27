import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { createQueryKey, type UseQueryParameters } from 'utils/reactQuery'
import { Address } from 'viem'
import { getRecentXOrders, GetXOrdersResponse } from './api'

const getRecentXOrdersQueryKey = createQueryKey<'x-orders', [chainId: number, address: Address]>('x-orders')

export type GetRecentXOrdersQueryKey = ReturnType<typeof getRecentXOrdersQueryKey>

export type GetRecentXOrdersReturnType = GetXOrdersResponse

type UseRecentXOrdersParameters<selectData = GetRecentXOrdersReturnType> = Partial<{
  chainId: number
  address: Address
}> &
  UseQueryParameters<GetRecentXOrdersReturnType, Error, selectData, GetRecentXOrdersQueryKey>

type UseRecentXOrdersReturnType<selectData = GetRecentXOrdersReturnType> = UseQueryResult<selectData, Error>

export function useRecentXOrders<selectData = GetRecentXOrdersReturnType>(
  parameters: UseRecentXOrdersParameters<selectData> = {},
): UseRecentXOrdersReturnType<selectData> {
  const { chainId, address, enabled = true, ...query } = parameters

  return useQuery({
    ...query,
    staleTime: 5_000,
    retry: 3,
    refetchOnMount: true,
    queryKey: getRecentXOrdersQueryKey([chainId!, address!]),
    queryFn: async () => {
      if (!chainId || !address) {
        throw new Error('No chainId or address provided')
      }

      return getRecentXOrders(chainId, address)
    },
    enabled: enabled && Boolean(chainId && address),
  })
}
