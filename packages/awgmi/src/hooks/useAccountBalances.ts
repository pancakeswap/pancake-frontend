import { formatUnits } from '@ethersproject/units'
import {
  CoinStoreResource,
  fetchAptosView,
  fetchBalances,
  FetchCoinResult,
  isHexStringEquals,
  unwrapTypeFromString,
  wrapCoinStoreTypeTag,
} from '@pancakeswap/awgmi/core'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { GetAccountCoinsDataResponse, MoveStructId, Hex } from '@aptos-labs/ts-sdk'

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

function convertHexStringToAsciiString(str: string) {
  const hex = Hex.fromHexInput(str).toStringWithoutPrefix()
  let converted = ''
  for (let i = 0; i < hex.length; i += 2) {
    converted += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
  }
  return converted
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
      const v2PairedCoins = await Promise.all(
        v2Balances.map((b) =>
          fetchAptosView({
            networkName,
            params: {
              typeArguments: [],
              function: '0x1::coin::paired_coin',
              functionArguments: [b.asset_type],
            },
          }),
        ),
      )
      const v2ToV1Map = new Map<string, string>()
      for (const [index, paired] of v2PairedCoins.entries()) {
        const pairedInfo = paired?.[0]?.vec?.[0]
        if (!pairedInfo) continue
        const moduleName = convertHexStringToAsciiString(pairedInfo.module_name)
        const structName = convertHexStringToAsciiString(pairedInfo.struct_name)
        v2ToV1Map.set(v2Balances[index].asset_type, [pairedInfo.account_address, moduleName, structName].join('::'))
      }

      const tokenIdentifierToBalance = new Map<string, number>()
      for (const b of v1Balances) {
        const id = getTokenMetadataIdentifier({
          name: b.metadata?.name,
          symbol: b.metadata?.symbol,
          decimals: b.metadata?.decimals,
        })
        if (tokenIdentifierToBalance.get(id)) {
          console.warn('Duplicate identifier for token', id)
        }
        tokenIdentifierToBalance.set(b.asset_type, b.amount)
      }
      for (const b of v2Balances) {
        const v1AssetType = v2ToV1Map.get(b.asset_type)
        if (!v1AssetType) {
          console.warn('Could not find valid v1 asset type for v2 asset', b.asset_type)
          continue
        }
        const v1Amount = tokenIdentifierToBalance.get(v1AssetType) ?? 0
        const finalAmount = v1Amount + b.amount
        tokenIdentifierToBalance.set(v1AssetType, finalAmount)
      }
      return Array.from(tokenIdentifierToBalance.keys()).map((key) => ({
        type: wrapCoinStoreTypeTag(key),
        data: {
          coin: {
            value: String(tokenIdentifierToBalance.get(key)),
          },
        },
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
