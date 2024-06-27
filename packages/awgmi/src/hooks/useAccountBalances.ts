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
import { UseAccountResourcesArgs, UseAccountResourcesConfig } from './useAccountResources'
import { useCoins } from './useCoins'
import { useNetwork } from './useNetwork'

export type UseAccountBalancesResult = { value: string; formatted: string } & FetchCoinResult

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesResult, Error, TData>

type UseAccountBalancesSelect<TData> = Pick<UseAccountBalances<TData>, 'select'>

export type UseAccountBalancesConfig<TData> = Omit<UseAccountResourcesConfig, 'select'> &
  UseAccountBalancesSelect<TData>

function getTokenMetadataIdentifier({ name, decimals, symbol }: { name?: string; decimals?: number; symbol?: string }) {
  return [name, decimals, symbol].join('_')
}

export function useAccountBalances<TData = unknown>({
  address,
  gcTime,
  enabled,
  networkName: networkName_,
  select,
  staleTime,
  watch,
  coinFilter,
}: UseAccountResourcesArgs & { coinFilter?: string } & UseAccountBalancesConfig<TData>) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const { data } = useQuery({
    queryKey: ['useAccountBalances', networkName, address],
    queryFn: async () => {
      if (!address) throw new Error('Invalid address')
      const balances = await fetchBalances({ address })
      const [v1Balances, v2Balances] = balances.reduce<[GetAccountCoinsDataResponse, GetAccountCoinsDataResponse]>(
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
      const balanceMap = new Map<
        MoveStructId,
        {
          type: MoveStructId
          data: {
            coin: {
              value: string
            }
          }
        }
      >()
      const tokenIdentifierToBalance = new Map<
        string,
        {
          type: MoveStructId
          amount: number
        }
      >()
      for (const b of v1Balances) {
        const id = getTokenMetadataIdentifier({
          name: b.metadata?.name,
          symbol: b.metadata?.symbol,
          decimals: b.metadata?.decimals,
        })
        if (tokenIdentifierToBalance.get(id)) {
          console.warn('Duplicate identifier for token', id)
        }
        tokenIdentifierToBalance.set(id, {
          type: b.asset_type as MoveStructId,
          amount: b.amount,
        })
        balanceMap.set(b.asset_type as MoveStructId, {
          type: b.asset_type as MoveStructId,
          data: {
            coin: {
              value: String(b.amount),
            },
          },
        })
      }
      for (const b of v2Balances) {
        const id = getTokenMetadataIdentifier({
          name: b.metadata?.name,
          symbol: b.metadata?.symbol,
          decimals: b.metadata?.decimals,
        })
        const sameAsset = tokenIdentifierToBalance.get(id)
        if (!sameAsset) {
          continue
        }
        balanceMap.set(sameAsset.type, {
          type: sameAsset.type,
          data: {
            coin: {
              value: String(b.amount + sameAsset.amount),
            },
          },
        })
      }
      return Array.from(balanceMap.values()).map((b) => ({
        ...b,
        type: wrapCoinStoreTypeTag(b.type),
      }))
    },
    gcTime,
    enabled: Boolean(networkName && address) && enabled,
    staleTime,
    refetchInterval: (d) => {
      if (!d) return 6_000
      return watch ? 3_000 : 0
    },
  })

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
