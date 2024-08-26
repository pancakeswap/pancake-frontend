import { formatUnits } from '@ethersproject/units'
import {
  CoinStoreResource,
  fetchBalances,
  FetchCoinResult,
  isHexStringEquals,
  unwrapTypeFromString,
  wrapCoinStoreTypeTag,
} from '@pancakeswap/awgmi/core'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { GetAccountCoinsDataResponse, MoveStructId } from '@aptos-labs/ts-sdk'

import { QueryConfig } from '../types'
import { UseAccountResourcesArgs, UseAccountResourcesConfig, queryKey } from './useAccountResources'
import { useCoins } from './useCoins'
import { useNetwork } from './useNetwork'
import { useV1CoinAssetTypes } from './useV1CoinAssetType'

export type UseAccountBalancesResult = { value: string; formatted: string } & FetchCoinResult

export type UseAccountBalancesQueryResult = [GetAccountCoinsDataResponse, GetAccountCoinsDataResponse]

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesQueryResult, Error, TData>

type UseAccountBalancesSelect<TData> = Pick<UseAccountBalances<TData>, 'enabled' | 'staleTime'>

type UseAccountBalancesConfig<TData> = Omit<UseAccountResourcesConfig, 'select' | 'enabled' | 'staleTime'> &
  UseAccountBalancesSelect<TData>

export function useAccountBalances<TData = unknown>({
  address,
  gcTime,
  enabled,
  networkName: networkName_,
  select,
  staleTime,
  watch,
  coinFilter,
}: UseAccountResourcesArgs & { coinFilter?: string } & UseAccountBalancesConfig<TData> & {
    select?: (data: UseAccountBalancesResult) => UseAccountBalancesResult | null | undefined
  }) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const { data: coinsData, isSuccess } = useQuery({
    queryKey: queryKey({ entity: 'useAccountBalances', networkName, address }),
    queryFn: async () => {
      if (!address) throw new Error('Invalid address')
      const balances = await fetchBalances({ address })
      return balances.reduce<[GetAccountCoinsDataResponse, GetAccountCoinsDataResponse]>(
        (acc, cur) => {
          const [v1, v2] = acc
          if (cur.token_standard === 'v1') {
            v1.push(cur)
          }
          if (cur.token_standard === 'v2') {
            v2.push(cur)
          }
          return acc
        },
        [[], []],
      )
    },
    gcTime,
    enabled: Boolean(networkName && address) && enabled,
    staleTime,
    refetchInterval: (d) => {
      if (!d) return 6_000
      return watch ? 3_000 : 0
    },
  })

  const v1Balances = coinsData?.[0]
  const v2Balances = coinsData?.[1]
  const v1AssetsTypes = useV1CoinAssetTypes({
    networkName,
    assetTypes: v2Balances?.map((b) => b.asset_type) || [],
    enabled: Boolean(isSuccess && v2Balances?.length),
  })
  const { isFetched, data: mappedV2Balances } = useMemo(() => {
    return {
      isFetched: v1AssetsTypes.every((data) => data.isFetched),
      isSuccess: v1AssetsTypes.every((data) => data.isSuccess),
      data: v1AssetsTypes
        .map((data, index) =>
          v2Balances?.[index] && data.data
            ? {
                ...v2Balances[index],
                asset_type: data.data,
              }
            : v2Balances?.[index],
        )
        .filter(Boolean),
    }
  }, [v1AssetsTypes])

  const allBalances = useMemo(
    () => (isSuccess && isFetched ? [...(v1Balances || []), ...mappedV2Balances] : undefined),
    [isSuccess, isFetched, v1Balances, mappedV2Balances],
  )

  const data = useMemo(() => {
    if (!allBalances) {
      return undefined
    }
    const assetTypeToBalance = new Map<string, number>()
    for (const b of allBalances) {
      if (!b) continue
      const id = b.asset_type
      const amount = assetTypeToBalance.get(id) || 0
      assetTypeToBalance.set(id, amount + b.amount)
    }
    return Array.from(assetTypeToBalance.keys()).map((key) => ({
      type: wrapCoinStoreTypeTag(key),
      data: {
        coin: {
          value: String(assetTypeToBalance.get(key)),
        },
      },
    }))
  }, [allBalances])

  const coinStoreResourceMap = useMemo(() => {
    return data?.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.type]: curr,
      }
    }, {} as Record<MoveStructId, CoinStoreResource>)
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
