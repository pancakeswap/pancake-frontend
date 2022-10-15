import { formatUnits } from '@ethersproject/units'
import {
  CoinStoreResource,
  coinStoreResourcesFilter,
  FetchAccountResourcesResult,
  FetchCoinResult,
  isHexStringEquals,
  unwrapTypeFromString,
  wrapCoinStoreTypeTag,
} from '@pancakeswap/awgmi/core'
import { UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { QueryConfig } from '../types'
import { useAccountResources, UseAccountResourcesArgs, UseAccountResourcesConfig } from './useAccountResources'
import { useCoins } from './useCoins'
import { useNetwork } from './useNetwork'

export type UseAccountBalancesResult = { value: string; formatted: string } & FetchCoinResult

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesResult, Error, TData>

type UseAccountBalancesSelect<TData> = Pick<UseAccountBalances<TData>, 'select'>

export type UseAccountBalancesConfig<TData> = Omit<UseAccountResourcesConfig, 'select'> &
  UseAccountBalancesSelect<TData>

const accountCoinStoreResourceSelect = (resource: FetchAccountResourcesResult) => {
  return resource.filter(coinStoreResourcesFilter)
}

export function useAccountBalances<TData = unknown>({
  address,
  cacheTime,
  enabled,
  isDataEqual,
  keepPreviousData,
  networkName: networkName_,
  onError,
  onSettled,
  onSuccess,
  select,
  staleTime,
  suspense,
  watch,
  coinFilter,
}: UseAccountResourcesArgs & { coinFilter?: string } & UseAccountBalancesConfig<TData>) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

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
    select: accountCoinStoreResourceSelect,
  })

  const coinStoreResourceMap = useMemo(() => {
    return data?.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.type]: curr,
      }
    }, {} as Record<string, CoinStoreResource>)
  }, [data])

  const coinInfoSelect = useCallback(
    (coinInfo: FetchCoinResult) => {
      if (!coinStoreResourceMap) return null
      const coinStoreResource = coinStoreResourceMap[wrapCoinStoreTypeTag(coinInfo.address)]
      if (!coinStoreResource) return null

      const result = {
        ...coinInfo,
        value: coinStoreResource.data.coin.value,
        formatted: formatUnits(coinStoreResource.data.coin.value ?? '0', coinInfo.decimals),
      }

      if (select) return select(result)

      return result
    },
    [coinStoreResourceMap, select],
  )

  const coins = useMemo(
    () =>
      (Object.keys(coinStoreResourceMap ?? {})
        .map((d) => unwrapTypeFromString(d))
        .filter((d) => (coinFilter && d ? isHexStringEquals(coinFilter, d) : true))
        .filter(Boolean) ?? []) as string[],
    [coinFilter, coinStoreResourceMap],
  )

  const coinResults = useCoins({
    enabled: !!coinStoreResourceMap,
    coins,
    select: coinInfoSelect,
  }) as UseQueryResult<unknown extends TData ? UseAccountBalancesResult : TData, Error>[]

  return coinResults
}
