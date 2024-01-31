import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import fetchPoolChartData from 'state/info/queries/pools/chartData'
import { fetchAllPoolData, fetchAllPoolDataWithAddress } from 'state/info/queries/pools/poolData'
import fetchPoolTransactions from 'state/info/queries/pools/transactions'
import { fetchGlobalChartData } from 'state/info/queries/protocol/chart'
import { fetchProtocolData } from 'state/info/queries/protocol/overview'
import fetchTopTransactions from 'state/info/queries/protocol/transactions'
import fetchTokenChartData from 'state/info/queries/tokens/chartData'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import { fetchAllTokenData, fetchAllTokenDataByAddresses } from 'state/info/queries/tokens/tokenData'
import fetchTokenTransactions from 'state/info/queries/tokens/transactions'
import { Block, Transaction } from 'state/info/types'
import { getAprsForStableFarm } from 'utils/getAprsForStableFarm'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlockFromTimeStampQuery } from 'views/Info/hooks/useBlocksFromTimestamps'
import { MultiChainName, MultiChainNameExtend, checkIsStableSwap, multiChainId } from './constant'
import { ChartEntry, PoolData, PriceChartEntry, ProtocolData, TokenData } from './types'

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
  const chainName = useChainNameByQuery()
  const [t24, t48] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48])
  const [block24, block48] = blocks ?? []
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: protocolData } = useQuery({
    queryKey: [`info/protocol/updateProtocolData/${type}`, chainName],
    queryFn: () => fetchProtocolData(chainName, block24, block48),
    enabled: Boolean(chainName && block24 && block48),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return protocolData ?? undefined
}

export const useProtocolChartDataQuery = (): ChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: chartData } = useQuery({
    queryKey: [`info/protocol/updateProtocolChartData/${type}`, chainName],
    queryFn: () => fetchGlobalChartData(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return chartData ?? undefined
}

export const useProtocolTransactionsQuery = (): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: transactions } = useQuery({
    queryKey: [`info/protocol/updateProtocolTransactionsData/${type}`, chainName],
    queryFn: () => fetchTopTransactions(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,

    // update latest Transactions per 15s
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return transactions ?? undefined
}

export const useAllPoolDataQuery = () => {
  const chainName = useChainNameByQuery()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d])
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pools/data/${type}`, chainName],
    queryFn: () => fetchAllPoolData(blocks ?? [], chainName),
    enabled: Boolean(blocks && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return useMemo(() => {
    return data ?? {}
  }, [data])
}

export const usePoolDatasQuery = (poolAddresses: string[]): (PoolData | undefined)[] => {
  const name = poolAddresses.join('')
  const chainName = useChainNameByQuery()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d])
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/data/${name}/${type}`, chainName],
    queryFn: () => fetchAllPoolDataWithAddress(blocks ?? [], chainName, poolAddresses),
    enabled: Boolean(blocks && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })

  return useMemo(() => {
    return poolAddresses
      .map((address) => {
        return data?.[address]?.data
      })
      .filter((pool) => pool)
  }, [data, poolAddresses])
}

export const usePoolChartDataQuery = (address: string): ChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/chartData/${address}/${type}`, chainName],
    queryFn: () => fetchPoolChartData(chainName, address),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data?.data ?? undefined
}

export const usePoolTransactionsQuery = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/pool/transactionsData/${address}/${type}`, chainName],
    queryFn: () => fetchPoolTransactions(chainName, address),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
  return data?.data ?? undefined
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
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d], undefined, undefined, chainName)
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
  const chainName = useChainNameByQuery()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d])
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/data/${type}`, chainName],
    queryFn: () => fetchAllTokenData(chainName, blocks ?? []),
    enabled: Boolean(blocks && chainName),
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

export const useTokenDatasQuery = (addresses?: string[], withSettings = true): TokenData[] | undefined => {
  const name = addresses?.join('')
  const chainName = useChainNameByQuery()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d])
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
  const allTokenData = useTokenDatasQuery([address ?? ''])
  return allTokenData?.find((d) => d.address === address) ?? undefined
}

export const usePoolsForTokenQuery = (address: string): string[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/poolAddress/${address}/${type}`, chainName],
    queryFn: () => fetchPoolsForToken(chainName, address),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })

  return data?.addresses ?? undefined
}

export const useTokenChartDataQuery = (address: string): ChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/chartData/${address}/${type}`, chainName],
    queryFn: () => fetchTokenChartData(chainName, address),
    enabled: Boolean(address && chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })

  return data?.data ?? undefined
}

export const useTokenPriceDataQuery = (
  address: string,
  interval: number,
  timeWindow: duration.Duration,
): PriceChartEntry[] | undefined => {
  const startTimestamp = dayjs().subtract(timeWindow).startOf('hours').unix()
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/priceData/${address}/${type}`, chainName],
    queryFn: () => fetchTokenPriceData(chainName, address, interval, startTimestamp),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return data?.data ?? undefined
}

export const useTokenTransactionsQuery = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useQuery({
    queryKey: [`info/token/transactionsData/${address}/${type}`, chainName],
    queryFn: () => fetchTokenTransactions(chainName, address),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_INTERVAL_REFETCH,
  })
  return data?.data ?? undefined
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

const stableSwapAPRWithAddressesFetcher = async (addresses: string[]) => {
  return Promise.all(addresses.map((d) => getAprsForStableFarm(d)))
}

export const useStableSwapTopPoolsAPR = (addresses: string[]): Record<string, number> => {
  const isStableSwap = checkIsStableSwap()
  const chainName = useChainNameByQuery()
  const { data } = useQuery<BigNumber[]>({
    queryKey: [`info/pool/stableAPRs/Addresses/`, chainName],
    queryFn: () => stableSwapAPRWithAddressesFetcher(addresses),
    enabled: Boolean(isStableSwap && addresses?.length > 0),
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
