import { formatUnits } from '@ethersproject/units'
import {
  CoinStoreResource,
  coinStoreResourcesFilter,
  FetchCoinResult,
  unwrapTypeFromString,
  wrapCoinStoreTypeTag,
} from '@pancakeswap/awgmi/core'
import { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QueryConfig } from '../types'
import { useAccountResources, UseAccountResourcesArgs, UseAccountResourcesConfig } from './useAccountResources'
import { useCoins } from './useCoins'

export type UseAccountBalancesResult = { value: string; formatted: string } & FetchCoinResult

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesResult, Error, TData>

type UseAccountBalancesSelect<TData> = Pick<UseAccountBalances<TData>, 'select'>

export type UseAccountBalancesConfig<TData> = Omit<UseAccountResourcesConfig, 'select'> &
  UseAccountBalancesSelect<TData>

export function useAccountBalances<TData = unknown>({
  address,
  cacheTime,
  enabled,
  isDataEqual,
  keepPreviousData,
  networkName,
  onError,
  onSettled,
  onSuccess,
  select,
  staleTime,
  suspense,
  watch,
  coinFilter,
}: UseAccountResourcesArgs & { coinFilter?: string } & UseAccountBalancesConfig<TData>) {
  const { data } = useAccountResources({
    address,
    cacheTime,
    enabled,
    isDataEqual,
    keepPreviousData,
    networkName,
    onError,
    onSettled,
    onSuccess,
    staleTime,
    suspense,
    watch,
    select: (d) => {
      return d.filter(coinStoreResourcesFilter).reduce((prev, curr) => {
        return {
          ...prev,
          [curr.type]: curr,
        }
      }, {} as Record<string, CoinStoreResource>)
    },
  })

  return useCoins({
    enabled: !!data,
    coins: useMemo(
      () =>
        (Object.keys(data ?? {})
          .map((d) => unwrapTypeFromString(d))
          .filter((d) => (coinFilter ? coinFilter === d : true))
          .filter(Boolean) ?? []) as string[],
      [coinFilter, data],
    ),
    select: (coinInfo) => {
      if (!data) return null
      const coinStoreResource = data[wrapCoinStoreTypeTag(coinInfo.address)]
      if (!coinStoreResource) return null

      const result = {
        ...coinInfo,
        value: coinStoreResource.data.coin.value,
        formatted: formatUnits(coinStoreResource.data.coin.value ?? '0', coinInfo.decimals),
      }

      if (select) return select(result)
      return result
    },
  }) as UseQueryResult<unknown extends TData ? UseAccountBalancesResult : TData, Error>[]
}
