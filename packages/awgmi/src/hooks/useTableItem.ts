/* eslint-disable camelcase */
import { getProvider } from '@pancakeswap/awgmi/core'
import { Types } from 'aptos'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

export type FetchTableItemArgs = {
  networkName?: string
  handle: string
  data: {
    key: Types.TableItemRequest['key']
    keyType: Types.TableItemRequest['key_type']
    valueType: Types.TableItemRequest['value_type']
  }
}

export type FetchTableItemResult = Types.MoveResource[]

export type UseTableItemConfig<TData = unknown> = QueryConfig<FetchTableItemResult, Error, TData>

export const queryKey = (params: { networkName?: string } & Partial<FetchTableItemArgs>) =>
  [{ entity: 'tableItem', ...params }] as const

const queryFn = ({ queryKey: [{ networkName, handle, data }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!handle || !data) throw new Error('Handle and data are required.')

  const provider = getProvider({ networkName })
  return provider.getTableItem(handle, {
    key_type: data.keyType,
    value_type: data.valueType,
    key: data.key,
  })
}

export function useTableItem<TData = unknown>({
  cacheTime,
  keepPreviousData,
  enabled = true,
  networkName: networkName_,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
  select,
  handle,
  data: data_,
}: Partial<FetchTableItemArgs> & UseTableItemConfig<TData>) {
  const { chain } = useNetwork()

  return useQuery(queryKey({ networkName: networkName_ ?? chain?.network, handle, data: data_ }), queryFn, {
    cacheTime,
    enabled: enabled && !!handle && !!data_,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    select,
    keepPreviousData,
    refetchInterval: (data) => {
      if (!data) return 6_000
      return 0
    },
  })
}
