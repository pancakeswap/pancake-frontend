import { Protocol } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { QUERY_SETTINGS_IMMUTABLE, QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH } from 'config/constants'
import { explorerApiClient } from 'state/info/api/client'
import { useExplorerChainNameByQuery } from 'state/info/api/hooks'
import { components } from 'state/info/api/schema'

const fetchChartVolumeData = async (
  address: string,
  chainName: components['schemas']['ChainName'],
  protocol: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
  signal?: AbortSignal,
) => {
  try {
    const resp = await explorerApiClient.GET('/cached/pools/chart/{protocol}/{chainName}/{address}/volume', {
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
        time: d.bucket as string,
        value: d.volumeUSD ? parseFloat(d.volumeUSD) ?? 0 : 0,
      }
    })
  } catch (error) {
    console.error('debug fetchChartVolumeData error', error)
    return []
  }
}

export const usePoolChartVolumeData = (
  address?: string,
  protocol?: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
) => {
  const chainName = useExplorerChainNameByQuery()

  return useQuery({
    queryKey: ['poolChartVolumeData', chainName, address, protocol],
    queryFn: () => fetchChartVolumeData(address!, chainName!, protocol!, period),
    enabled: !!address && !!protocol && !!chainName,
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
}
