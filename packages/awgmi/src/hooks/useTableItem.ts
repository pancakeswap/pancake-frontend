/* eslint-disable camelcase */
import { FetchTableItemArgs, fetchTableItem } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQueries, useQuery } from '@tanstack/react-query'
import { MoveResource } from '@aptos-labs/ts-sdk'
import { useMemo } from 'react'

import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

export type FetchTableItemResult = MoveResource[]

export type UseTableItemConfig<TData = unknown> = QueryConfig<FetchTableItemResult, Error, TData, QueryKey>

type QueryKey = ReturnType<typeof queryKey>

export const queryKey = (params: { networkName?: string } & Partial<FetchTableItemArgs>) =>
  [{ entity: 'tableItem', ...params }] as const

const queryFn: QueryFunction<FetchTableItemResult, QueryKey> = ({
  queryKey: [{ networkName, handle, data }],
}): Promise<FetchTableItemResult> => {
  if (!handle || !data) throw new Error('Handle and data are required.')

  return fetchTableItem({ networkName, handle, data })
}

export type PayloadTableItem = {
  keyType: string
  valueType: string
  key: any
}

export function useTableItems({
  handles,
  data: data_,
  networkName: networkName_,
}: {
  handles?: string[]
  data?: PayloadTableItem[]
  networkName?: string
}) {
  const { chain } = useNetwork()

  return useQueries({
    queries: useMemo(
      () =>
        handles?.length && data_?.length
          ? handles.map((handle, idx) => ({
              handle,
              queryFn,
              queryKey: queryKey({ networkName: networkName_ ?? chain?.network, handle, data: data_[idx] }),
              staleTime: Infinity,
              refetchInterval: 3_000,
            }))
          : [],
      [chain?.network, handles, networkName_, data_],
    ),
  })
}

export function useTableItem<TData = unknown>({
  gcTime,
  enabled = true,
  networkName: networkName_,
  staleTime,
  select,
  handle,
  data: data_,
  ...query
}: Partial<FetchTableItemArgs> & UseTableItemConfig<TData>) {
  const { chain } = useNetwork()

  return useQuery({
    ...query,
    gcTime,
    queryKey: queryKey({ networkName: networkName_ ?? chain?.network, handle, data: data_ }),
    queryFn,
    enabled: enabled && !!handle && !!data_,
    staleTime,
    select,
    refetchInterval: (data) => {
      if (!data) return 6_000
      return 3_000
    },
  })
}
