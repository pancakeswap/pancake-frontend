import { useQuery } from '@tanstack/react-query'
import { GAUGES } from 'config/constants/gauges'
import { useMemo } from 'react'
import { MultiChainName, multiChainName } from 'state/info/constant'
import { fetchAllPoolDataWithAddress } from 'state/info/queries/pools/poolData'
import { PoolData as V2PoolData } from 'state/info/types'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { v3InfoClients } from 'utils/graphql'
import { Address } from 'viem'
import { useBlockFromTimeStampQuery } from 'views/Info/hooks/useBlocksFromTimestamps'
import { fetchPoolDatas } from 'views/V3Info/data/pool/poolData'
import { PoolData as V3PoolData } from 'views/V3Info/types'
import { feeTierPercent } from 'views/V3Info/utils'
import { getGaugeHash } from '../utils'
import { useGauges } from './useGauges'

const QUERY_SETTINGS_IMMUTABLE = {
  retry: 3,
  retryDelay: 3000,
  keepPreviousData: true,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}

export const useV3PoolData = (address?: string, chainId?: number): V3PoolData | undefined => {
  const { data } = useQuery(
    [`v3/info/pool/poolData/${chainId}/${address}`, chainId],
    () => fetchPoolDatas(v3InfoClients[chainId!], [address!], []),
    {
      enabled: Boolean(chainId && address && address !== 'undefined'),
      ...QUERY_SETTINGS_IMMUTABLE,
    },
  )

  if (!address) return undefined

  return data?.data?.[address] ?? undefined
}

export const useV2PairData = (address?: string, chainId?: number): V2PoolData | undefined => {
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24h, t48h, t7d, t14d])
  const { data } = useQuery(
    // @fixme support stableswap
    [`info/pool/data/${address}/swap`, chainId],
    () => fetchAllPoolDataWithAddress(blocks ?? [], multiChainName[chainId!] as MultiChainName, [address!]),
    {
      enabled: Boolean(chainId) && Boolean(address),
      ...QUERY_SETTINGS_IMMUTABLE,
      // ...QUERY_SETTINGS_INTERVAL_REFETCH,
    },
  )
  if (!address) return undefined
  return data?.[address]?.data
}

export const useGaugePair = (address?: string, chainId?: number) => {
  const v2 = useV2PairData(address, chainId)
  const v3 = useV3PoolData(address, chainId)

  const token0 = useMemo(() => {
    if (v2) return v2.token0
    if (v3) return v3.token0
    return undefined
  }, [v2, v3])

  const token1 = useMemo(() => {
    if (v2) return v2.token1
    if (v3) return v3.token1
    return undefined
  }, [v2, v3])

  const pairName = useMemo(() => {
    return `${token0?.symbol}-${token1?.symbol}`
  }, [token0?.symbol, token1?.symbol])

  const feeTier = useMemo(() => (v3?.feeTier ? feeTierPercent(v3?.feeTier) : undefined), [v3?.feeTier])
  return {
    v2,
    v3,
    token0,
    token1,
    pairName,
    feeTier,
  }
}

export const useGaugeConfig = (address?: Address, chainId?: number) => {
  const gauges = useGauges()
  const published = gauges?.some((gauge) => gauge.hash === getGaugeHash(address, chainId))
  const config = GAUGES.find((gauge) => gauge.chainId === chainId && gauge.address === address)

  // only on-chain gauges will show up
  if (!published) return undefined

  if (!config) throw new Error(`Gauge config not found for ${address} on chain ${chainId}`)

  return config
}
