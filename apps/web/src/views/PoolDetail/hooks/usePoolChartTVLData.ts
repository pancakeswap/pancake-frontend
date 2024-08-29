import { Protocol } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { QUERY_SETTINGS_IMMUTABLE, QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH } from 'config/constants'
import dayjs from 'dayjs'
import { explorerApiClient } from 'state/info/api/client'
import { useExplorerChainNameByQuery } from 'state/info/api/hooks'
import { components } from 'state/info/api/schema'

const fetchChartTVLData = async (
  address: string,
  chainName: components['schemas']['ChainName'],
  protocol: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
  signal?: AbortSignal,
) => {
  try {
    const resp = await explorerApiClient.GET('/cached/pools/chart/{protocol}/{chainName}/{address}/tvl', {
      signal,
      params: {
        path: {
          address,
          chainName,
          protocol,
        },
        query: {
          period,
        },
      },
    })
    if (!resp.data) {
      return []
    }

    return resp.data.map((d) => {
      return {
        time: dayjs(d.bucket as string).toDate(),
        value: d.tvlUSD ? parseFloat(d.tvlUSD) ?? 0 : 0,
      }
    })
  } catch (error) {
    console.error('debug fetchChartTvlData error', error)
    return []
  }
}

export const usePoolChartTVLData = (
  address?: string,
  protocol?: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
) => {
  const chainName = useExplorerChainNameByQuery()

  return useQuery({
    queryKey: ['poolChartTVLData', chainName, address, protocol],
    queryFn: () => fetchChartTVLData(address!, chainName!, protocol!, period),
    enabled: !!address && !!protocol && !!chainName,
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
}
