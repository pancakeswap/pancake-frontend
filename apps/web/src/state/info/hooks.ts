import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { STABLE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/stable-swap-sdk'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { fetchAllTokenData, fetchAllTokenDataByAddresses } from 'state/info/queries/tokens/tokenData'
import { Block, Transaction, TransactionType, TvlChartEntry, VolumeChartEntry } from 'state/info/types'
import { getAprsForStableFarm } from 'utils/getAprsForStableFarm'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { getLpFeesAndApr } from 'utils/getLpFeesAndApr'
import { getPercentChange } from 'utils/infoDataHelpers'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { explorerApiClient } from './api/client'
import { useExplorerChainNameByQuery } from './api/hooks'
import { operations } from './api/schema'
import { checkIsStableSwap, multiChainId, MultiChainName, MultiChainNameExtend } from './constant'
import { PoolData, PriceChartEntry, ProtocolData, TokenData } from './types'

dayjs.extend(duration)

// Protocol hooks

const refreshIntervalForInfo = 15000 // 15s
const QUERY_SETTINGS_IMMUTABLE = {
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
}
const QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH = {
  retry: 3,
  retryDelay: 3000,
}
const QUERY_SETTINGS_INTERVAL_REFETCH = {
  refetchInterval: refreshIntervalForInfo,
  keepPreviousData: true,
  ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
}

export const useProtocolDataQuery = (): ProtocolData | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: protocolData } = useQuery({
    queryKey: [`info/protocol/updateProtocolData2/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/protocol/{protocol}/{chainName}/stats', {
          signal,
          params: {
            path: {
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
          },
        })

        .then((res) => {
          if (res.data) {
            const { data } = res
            const volumeUSD = data.volumeUSD24h ? parseFloat(data.volumeUSD24h) : 0
            const volumeOneWindowAgo =
              data.volumeUSD24h && data.volumeUSD48h
                ? parseFloat(data.volumeUSD48h) - parseFloat(data.volumeUSD24h)
                : undefined
            const volumeUSDChange =
              volumeUSD && volumeOneWindowAgo ? getPercentChange(volumeUSD, volumeOneWindowAgo) : undefined
            const tvlUSDChange = getPercentChange(+data.tvlUSD, +data.tvlUSD24h)
            const txCount = data.txCount24h

            const txCountOneWindowAgo =
              data.txCount24h && data.txCount48h ? data.txCount48h - data.txCount24h : undefined
            const txCountChange = txCount && txCountOneWindowAgo ? getPercentChange(txCount, txCountOneWindowAgo) : 0
            return {
              volumeUSD,
              volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
              liquidityUSD: +res.data.tvlUSD,
              liquidityUSDChange: tvlUSDChange,
              txCount,
              txCountChange,
            }
          }
          throw new Error('No data')
        })
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return protocolData ?? undefined
}

export const useProtocolChartDataTvlQuery = (): TvlChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: chartData } = useQuery({
    queryKey: [`info/protocol/chart/tvl/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/protocol/chart/{protocol}/{chainName}/tvl', {
          signal,
          params: {
            path: {
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              groupBy: '1D',
            },
          },
        })
        .then(
          (res) =>
            res.data?.map((d) => {
              return {
                date: dayjs(d.bucket as string).unix(),
                liquidityUSD: d.tvlUSD ? +d.tvlUSD : 0,
              }
            }) ?? [],
        )
    },
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return chartData ?? undefined
}

export const useProtocolChartDataVolumeQuery = (): VolumeChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: chartData } = useQuery({
    queryKey: [`info/protocol/chart/volume/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/protocol/chart/{protocol}/{chainName}/volume', {
          signal,
          params: {
            path: {
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              groupBy: '1D',
            },
          },
        })
        .then(
          (res) =>
            res.data?.map((d) => {
              return {
                date: dayjs(d.bucket as string).unix(),
                volumeUSD: d.volumeUSD ? +d.volumeUSD : 0,
              }
            }) ?? [],
        )
    },
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return chartData ?? undefined
}

export const useProtocolTransactionsQuery = (): Transaction[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: transactions } = useQuery({
    queryKey: [`info/protocol/updateProtocolTransactionsData2/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/tx/stable/{chainName}/recent', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedTxStableByChainNameRecent']['parameters']['path']['chainName'],
              },
            },
          })
          .then((res) => res.data)
      }

      return explorerApiClient
        .GET('/cached/tx/v2/{chainName}/recent', {
          signal,
          params: {
            path: {
              chainName,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((data_) => {
      return data_?.map((d) => {
        return {
          hash: d.transactionHash,
          timestamp: dayjs(d.timestamp as string)
            .unix()
            .toString(),
          sender: d.origin ?? '0x',
          type:
            d.type === 'swap' ? TransactionType.SWAP : d.type === 'mint' ? TransactionType.MINT : TransactionType.BURN,
          token0Symbol: d.token0.symbol ?? 'Unknown',
          token1Symbol: d.token1.symbol ?? 'Unknown',
          token0Address: d.token0.id,
          token1Address: d.token1.id,
          amountUSD: +d.amountUSD,
          amountToken0: +d.amount0,
          amountToken1: +d.amount1,
        }
      })
    }, []),
    ...QUERY_SETTINGS_IMMUTABLE,

    // update latest Transactions per 15s
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return transactions ?? undefined
}

export const useAllPoolDataQuery = () => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pools2/data/${type}`, chainName],
    queryFn: async () => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/pools/stable/{chainName}/list/top', {
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedPoolsStableByChainNameListTop']['parameters']['path']['chainName'],
              },
            },
          })
          .then((res) => res.data)
      }
      return explorerApiClient
        .GET('/cached/pools/v2/{chainName}/list/top', {
          params: {
            path: {
              chainName,
            },
          },
        })
        .then((res) => res.data)
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
    select: useCallback((data_) => {
      if (!data_) {
        throw new Error('No data')
      }

      const final: {
        [address: string]: {
          data: PoolData
        }
      } = {}

      for (const d of data_) {
        const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
          +d.volumeUSD24h,
          +d.volumeUSD7d,
          +d.tvlUSD,
        )
        final[d.id] = {
          data: {
            address: d.id,
            lpAddress: d.lpAddress,
            timestamp: dayjs(d.createdAtTimestamp as string).unix(),
            token0: {
              address: d.token0.id,
              symbol: d.token0.symbol,
              name: d.token0.name,
              decimals: d.token0.decimals,
            },
            token1: {
              address: d.token1.id,
              symbol: d.token1.symbol,
              name: d.token1.name,
              decimals: d.token1.decimals,
            },
            feeTier: d.feeTier,
            volumeUSD: +d.volumeUSD24h,
            volumeUSDChange: 0,
            volumeUSDWeek: +d.volumeUSD7d,
            liquidityUSD: +d.tvlUSD,
            liquidityUSDChange: getPercentChange(+d.tvlUSD, d.tvlUSD24h ? +d.tvlUSD24h : 0),
            totalFees24h,
            totalFees7d,
            lpFees24h,
            lpFees7d,
            lpApr7d,
            liquidityToken0: +d.tvlToken0,
            liquidityToken1: +d.tvlToken1,
            token0Price: +d.token0Price,
            token1Price: +d.token1Price,
            volumeUSDChangeWeek: 0,
          },
        }
      }

      return final
    }, []),
  })
  return useMemo(() => {
    return data ?? {}
  }, [data])
}

export function usePoolDataQuery(poolAddress: string): PoolData | undefined {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/data/${poolAddress}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/pools/stable/{chainName}/{address}', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedPoolsStableByChainNameByAddress']['parameters']['path']['chainName'],
                address: poolAddress,
              },
            },
          })
          .then((res) => res.data)
      }
      return explorerApiClient
        .GET('/cached/pools/v2/{chainName}/{address}', {
          signal,
          params: {
            path: {
              chainName,
              address: poolAddress,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((data_) => {
      if (!data_) {
        throw new Error('No data')
      }

      const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
        +data_.volumeUSD24h,
        +data_.volumeUSD7d,
        +data_.tvlUSD,
      )

      return {
        address: data_.id,
        lpAddress: data_.lpAddress,
        timestamp: dayjs(data_.createdAtTimestamp as string).unix(),
        token0: {
          address: data_.token0.id,
          symbol: data_.token0.symbol,
          name: data_.token0.name,
          decimals: data_.token0.decimals,
        },
        token1: {
          address: data_.token1.id,
          symbol: data_.token1.symbol,
          name: data_.token1.name,
          decimals: data_.token1.decimals,
        },
        volumeUSD: +data_.volumeUSD24h,
        volumeUSDChange: 0,
        volumeUSDWeek: +data_.volumeUSD7d,
        liquidityUSD: +data_.tvlUSD,
        liquidityUSDChange: getPercentChange(+data_.tvlUSD, data_.tvlUSD24h ? +data_.tvlUSD24h : 0),
        totalFees24h,
        totalFees7d,
        lpFees24h,
        lpFees7d,
        lpApr7d,
        liquidityToken0: +data_.tvlToken0,
        liquidityToken1: +data_.tvlToken1,
        token0Price: +data_.token0Price,
        token1Price: +data_.token1Price,
        volumeUSDChangeWeek: 0,
        feeTier: data_.feeTier,
      }
    }, []),
    enabled: Boolean(chainName && poolAddress),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data
}

export const usePoolChartTvlDataQuery = (address: string): TvlChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/chartData/tvl/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/pools/chart/{protocol}/{chainName}/{address}/tvl', {
          signal,
          params: {
            path: {
              address,
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              period: '1Y',
            },
          },
        })
        .then((res) =>
          res?.data?.map((d) => ({
            date: dayjs(d.bucket as string).unix(),
            liquidityUSD: d.tvlUSD ? +d.tvlUSD : 0,
          })),
        )
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data ?? undefined
}
export const usePoolChartVolumeDataQuery = (address: string): VolumeChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/chartData/volume/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/pools/chart/{protocol}/{chainName}/{address}/volume', {
          signal,
          params: {
            path: {
              address,
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              period: '1Y',
            },
          },
        })
        .then((res) =>
          res.data?.map((d) => ({
            date: dayjs(d.bucket as string).unix(),
            volumeUSD: d.volumeUSD ? +d.volumeUSD : 0,
          })),
        )
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data ?? undefined
}

export const usePoolTransactionsQuery = (address: string): Transaction[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/transactionsData2/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/tx/stable/{chainName}/recent', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedTxStableByChainNameRecent']['parameters']['path']['chainName'],
              },
              query: {
                pool: address,
              },
            },
          })
          .then((res) => res.data)
      }
      return explorerApiClient
        .GET('/cached/tx/v2/{chainName}/recent', {
          signal,
          params: {
            path: {
              chainName,
            },
            query: {
              pool: address,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((data_) => {
      if (!data_) {
        throw new Error('No data')
      }
      return data_.map((d) => {
        return {
          type:
            d.type === 'swap' ? TransactionType.SWAP : d.type === 'mint' ? TransactionType.MINT : TransactionType.BURN,
          hash: d.transactionHash,
          timestamp: dayjs(d.timestamp as string)
            .unix()
            .toString(),
          sender: d.origin ?? d.recipient ?? 'Unknown',
          amountUSD: +d.amountUSD,
          amountToken0: +d.amount0,
          amountToken1: +d.amount1,
          token0Symbol: d.token0.symbol ?? 'Unknown',
          token1Symbol: d.token1.symbol ?? 'Unknown',
          token0Address: d.token0.id,
          token1Address: d.token1.id,
        }
      })
    }, []),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data ?? undefined
}

// Tokens hooks

export const useAllTokenHighLight = ({
  enable,
  targetChainName,
}: {
  enable?: boolean
  targetChainName?: MultiChainNameExtend
}): TokenData[] => {
  const chainNameByQuery = useChainNameByQuery()
  const chainName = targetChainName ?? chainNameByQuery
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d], undefined, chainName)
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data, isPending } = useQuery({
    queryKey: [`info/token/data/${type}`, chainName],
    queryFn: () => fetchAllTokenData(chainName, blocks ?? []),
    enabled: Boolean(enable && blocks && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })

  const tokensWithData = useMemo(() => {
    return data
      ? Object.keys(data)
          .map((k) => {
            return data?.[k]?.data
          })
          .filter((d) => d && d.exists)
      : []
  }, [data])
  return useMemo(() => {
    return isPending ? [] : tokensWithData ?? []
  }, [isPending, tokensWithData])
}

export const useAllTokenDataQuery = (): {
  [address: string]: { data?: TokenData }
} => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/data2/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      const final: { [address: string]: { data?: TokenData } } = {}
      let data_

      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        data_ = await explorerApiClient
          .GET('/cached/tokens/stable/{chainName}/list/top', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedTokensStableByChainNameListTop']['parameters']['path']['chainName'],
              },
            },
          })
          .then((res) => res.data)
      } else {
        data_ = await explorerApiClient
          .GET('/cached/tokens/v2/{chainName}/list/top', {
            signal,
            params: {
              path: {
                chainName,
              },
            },
          })
          .then((res) => res.data)
      }

      for (const d of data_) {
        final[d.id] = {
          data: {
            exists: true,
            name: d.name,
            symbol: d.symbol,
            address: d.id,
            decimals: d.decimals,
            volumeUSD: d.volumeUSD24h ? +d.volumeUSD24h : 0,
            volumeUSDChange: 0,
            volumeUSDWeek: d.volumeUSD7d ? +d.volumeUSD7d : 0,
            txCount: d.txCount24h,
            liquidityToken: +d.tvl,
            liquidityUSD: +d.tvlUSD,
            liquidityUSDChange: getPercentChange(+d.tvlUSD, +d.tvlUSD24h),
            priceUSD: +d.priceUSD,
            priceUSDChange: getPercentChange(+d.priceUSD, +d.priceUSD24h),
            priceUSDChangeWeek: getPercentChange(+d.priceUSD, +d.priceUSD7d),
          },
        }
      }

      return final
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })

  return data ?? {}
}

const graphPerPage = 50

const fetcher = (addresses: string[], chainName: MultiChainName, blocks: Block[]) => {
  const times = Math.ceil(addresses.length / graphPerPage)
  const addressGroup: Array<string[]> = []
  for (let i = 0; i < times; i++) {
    addressGroup.push(addresses.slice(i * graphPerPage, (i + 1) * graphPerPage))
  }
  return Promise.all(addressGroup.map((d) => fetchAllTokenDataByAddresses(chainName, blocks, d)))
}

/**
 * @deprecated
 */
export const useTokenDatasQuery = (addresses?: string[], withSettings = true): TokenData[] | undefined => {
  const name = addresses?.join('')
  const chainName = useChainNameByQuery()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data, isPending } = useQuery({
    queryKey: [`info/token/data/${name}/${type}`, chainName],
    queryFn: () => fetcher(addresses || [], chainName, blocks ?? []),
    enabled: Boolean(blocks && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...(withSettings ? QUERY_SETTINGS_INTERVAL_REFETCH : QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH),
  })
  const allData = useMemo(() => {
    return data && data.length > 0
      ? data.reduce((a, b) => {
          return { ...a, ...b }
        }, {})
      : {}
  }, [data])

  const tokensWithData = useMemo(() => {
    if (!addresses && allData) {
      return undefined
    }
    return addresses?.map((a) => allData?.[a]?.data)?.filter((d) => d && d.exists)
  }, [addresses, allData])

  return useMemo(() => {
    return isPending ? [] : tokensWithData ?? undefined
  }, [isPending, tokensWithData])
}

export const useTokenDataQuery = (address: string | undefined): TokenData | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'

  const { data } = useQuery({
    queryKey: [`info/token/data/${address}/${type}/`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName || !address) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/tokens/stable/{chainName}/{address}', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedTokensStableByChainNameByAddress']['parameters']['path']['chainName'],
                address,
              },
            },
          })
          .then((res) => res.data)
      }

      return explorerApiClient
        .GET('/cached/tokens/v2/{chainName}/{address}', {
          signal,
          params: {
            path: {
              chainName,
              address,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((d) => {
      if (!d) {
        throw new Error('No data')
      }
      return {
        exists: true,
        name: d.name,
        symbol: d.symbol,
        address: d.id,
        decimals: d.decimals,
        volumeUSD: d.volumeUSD24h ? +d.volumeUSD24h : 0,
        volumeUSDChange: 0,
        volumeUSDWeek: d.volumeUSD7d ? +d.volumeUSD7d : 0,
        txCount: d.txCount24h,
        liquidityToken: +d.tvl,
        liquidityUSD: +d.tvlUSD,
        liquidityUSDChange: getPercentChange(+d.tvlUSD, +d.tvlUSD24h),
        priceUSD: +d.priceUSD,
        priceUSDChange: getPercentChange(+d.priceUSD, +d.priceUSD24h),
        priceUSDChangeWeek: getPercentChange(+d.priceUSD, +d.priceUSD7d),
      }
    }, []),
    enabled: Boolean(address && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })

  return data
}

export function usePoolsForTokenDataQuery(address: string): (PoolData | undefined)[] {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/chartData2/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName || !address) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/pools/stable/{chainName}/list/top', {
            signal,
            params: {
              query: {
                token: address,
              },
              path: {
                chainName:
                  chainName as operations['getCachedPoolsStableByChainNameListTop']['parameters']['path']['chainName'],
              },
            },
          })
          .then((res) => res.data)
      }
      return explorerApiClient
        .GET('/cached/pools/v2/{chainName}/list/top', {
          params: {
            query: {
              token: address,
            },
            path: {
              chainName,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((data_) => {
      if (!data_) {
        throw new Error('No data')
      }

      return data_.map((d) => {
        const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
          +d.volumeUSD24h,
          +d.volumeUSD7d,
          +d.tvlUSD,
        )

        return {
          address: d.id,
          timestamp: dayjs(d.createdAtTimestamp as string).unix(),
          token0: {
            address: d.token0.id,
            symbol: d.token0.symbol,
            name: d.token0.name,
          },
          token1: {
            address: d.token1.id,
            symbol: d.token1.symbol,
            name: d.token1.name,
          },
          volumeUSD: +d.volumeUSD24h,
          volumeUSDChange: 0,
          volumeUSDWeek: +d.volumeUSD7d,
          liquidityUSD: +d.tvlUSD,
          liquidityUSDChange: getPercentChange(+d.tvlUSD, d.tvlUSD24h ? +d.tvlUSD24h : 0),
          totalFees24h,
          totalFees7d,
          lpFees24h,
          lpFees7d,
          lpApr7d,
          liquidityToken0: +d.tvlToken0,
          liquidityToken1: +d.tvlToken1,
          token0Price: +d.token0Price,
          token1Price: +d.token1Price,
          volumeUSDChangeWeek: 0,
        }
      })
    }, []),
    enabled: Boolean(address && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })

  return data ?? []
}

export const useTokenChartTvlDataQuery = (address: string): TvlChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/chartData/tvl/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/tokens/chart/{chainName}/{address}/{protocol}/tvl', {
          signal,
          params: {
            path: {
              address,
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              period: '1Y',
            },
          },
        })
        .then((res) =>
          res?.data?.map((d) => ({
            date: dayjs(d.bucket as string).unix(),
            liquidityUSD: d.tvlUSD ? +d.tvlUSD : 0,
          })),
        )
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data ?? undefined
}
export const useTokenChartVolumeDataQuery = (address: string): VolumeChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/chartData/volume/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/tokens/chart/{chainName}/{address}/{protocol}/volume', {
          signal,
          params: {
            path: {
              address,
              chainName,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              period: '1Y',
            },
          },
        })
        .then((res) =>
          res.data?.map((d) => ({
            date: dayjs(d.bucket as string).unix(),
            volumeUSD: d.volumeUSD ? +d.volumeUSD : 0,
          })),
        )
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data ?? undefined
}

export const useTokenPriceDataQuery = (
  address: string,
  _interval: number,
  _timeWindow: duration.Duration,
): PriceChartEntry[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/priceData2/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      return explorerApiClient
        .GET('/cached/tokens/chart/{chainName}/{address}/{protocol}/price', {
          signal,
          params: {
            path: {
              chainName,
              address,
              protocol: type === 'stableSwap' ? 'stable' : 'v2',
            },
            query: {
              period: '1M',
            },
          },
        })
        .then((res) =>
          res.data?.map((d) => {
            return {
              time: dayjs(d.bucket as string).unix(),
              open: d.open ? +d.open : 0,
              close: d.close ? +d.close : 0,
              high: d.high ? +d.high : 0,
              low: d.low ? +d.low : 0,
            }
          }),
        )
    },
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return data ?? undefined
}

export const useTokenTransactionsQuery = (address: string): Transaction[] | undefined => {
  const chainName = useExplorerChainNameByQuery()
  const chainId = useChainIdByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/transactionsData/${address}/${type}`, chainName],
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('No chain name')
      }
      if (type === 'stableSwap' && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId as number)) {
        return explorerApiClient
          .GET('/cached/tx/stable/{chainName}/recent', {
            signal,
            params: {
              path: {
                chainName:
                  chainName as operations['getCachedTxStableByChainNameRecent']['parameters']['path']['chainName'],
              },
              query: {
                token: address,
              },
            },
          })
          .then((res) => res.data)
      }

      return explorerApiClient
        .GET('/cached/tx/v2/{chainName}/recent', {
          signal,
          params: {
            path: {
              chainName,
            },
            query: {
              token: address,
            },
          },
        })
        .then((res) => res.data)
    },
    select: useCallback((data_) => {
      return data_?.map((d) => {
        return {
          hash: d.transactionHash,
          timestamp: dayjs(d.timestamp as string)
            .unix()
            .toString(),
          sender: d.origin ?? '0x',
          type:
            d.type === 'swap' ? TransactionType.SWAP : d.type === 'mint' ? TransactionType.MINT : TransactionType.BURN,
          token0Symbol: d.token0.symbol,
          token1Symbol: d.token1.symbol,
          token0Address: d.token0.id,
          token1Address: d.token1.id,
          amountUSD: +d.amountUSD,
          amountToken0: +d.amount0,
          amountToken1: +d.amount1,
        }
      })
    }, []),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return data ?? undefined
}

export const useGetChainName = () => {
  const { pathname, query } = useRouter()

  const getChain = useCallback(() => {
    if (pathname.includes('eth') || query.chain === 'eth') return 'ETH'
    return 'BSC'
  }, [pathname, query])
  const [name, setName] = useState<MultiChainName | null>(() => getChain())
  const result = useMemo(() => name, [name])

  useEffect(() => {
    setName(getChain())
  }, [getChain])

  return result
}

export const useChainNameByQuery = (): MultiChainName => {
  const { query } = useRouter()
  const chainName = useMemo(() => {
    switch (query?.chainName) {
      case 'eth':
        return 'ETH'
      case 'polygon-zkevm':
        return 'POLYGON_ZKEVM'
      case 'zksync':
        return 'ZKSYNC'
      case 'arb':
        return 'ARB'
      case 'linea':
        return 'LINEA'
      case 'base':
        return 'BASE'
      case 'opbnb':
        return 'OPBNB'
      default:
        return 'BSC'
    }
  }, [query])
  return chainName
}

export const useChainIdByQuery = () => {
  const chainName = useChainNameByQuery()
  const chainId = useMemo(() => {
    return multiChainId[chainName]
  }, [chainName])
  return chainId
}

const stableSwapAPRWithAddressesFetcher = async (addresses: string[], chainId?: number) => {
  return Promise.all(addresses.map((d) => getAprsForStableFarm(d, chainId)))
}

export const useStableSwapTopPoolsAPR = (addresses: string[]): Record<string, number> => {
  const isStableSwap = checkIsStableSwap()
  const chainName = useChainNameByQuery()
  const { data } = useQuery<BigNumber[]>({
    queryKey: [`info/pool/stableAPRs/Addresses/`, chainName],
    queryFn: () => stableSwapAPRWithAddressesFetcher(addresses, multiChainId[chainName]),
    enabled: Boolean(isStableSwap && addresses?.length > 0) && Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  const addressWithAPR = useMemo(() => {
    const result: Record<string, number> = {}
    data?.forEach((d, index) => {
      result[addresses[index]] = d?.toNumber()
    })
    return result
  }, [addresses, data])
  return useMemo(() => {
    return isStableSwap ? addressWithAPR : {}
  }, [isStableSwap, addressWithAPR])
}

export const useMultiChainPath = () => {
  const router = useRouter()
  const { chainName } = router.query
  return chainName ? `/${chainName}` : ''
}

export const useStableSwapPath = () => {
  return checkIsStableSwap() ? '?type=stableSwap' : ''
}
