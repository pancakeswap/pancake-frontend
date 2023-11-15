import { useQuery } from '@tanstack/react-query'
import { PoolData as V3PoolData } from 'views/V3Info/types'
import { fetchPoolDatas } from 'views/V3Info/data/pool/poolData'
import { v3InfoClients } from 'utils/graphql'
import { PoolData as V2PoolData } from 'state/info/types'
import { fetchAllPoolDataWithAddress } from 'state/info/queries/pools/poolData'
import { MultiChainName, multiChainName } from 'state/info/constant'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlockFromTimeStampQuery } from 'views/Info/hooks/useBlocksFromTimestamps'

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

  console.debug('debug poolData v3', data, { chainId, address })

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
  console.debug('debug poolData v2', data)
  return data?.[address]?.data
}
