import { useQuery } from '@tanstack/react-query'
import { QUERY_SETTINGS_IMMUTABLE, QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH } from 'config/constants'
import dayjs from 'dayjs'
import { explorerApiClient } from 'state/info/api/client'
import { useExplorerChainNameByQuery } from 'state/info/api/hooks'
import { components } from 'state/info/api/schema'

const fetchChartFeeData = async (
  address: string,
  chainName: components['schemas']['ChainName'],
  signal?: AbortSignal,
) => {
  try {
    const resp = await explorerApiClient.GET('/cached/pools/chart/v3/{chainName}/{address}/fees', {
      signal,
      params: {
        path: {
          address,
          chainName,
        },
      },
    })
    if (!resp.data) {
      return []
    }

    return resp.data.map((d) => {
      return {
        time: d.bucket as string,
        dateTime: dayjs(d.bucket as string).format('YYYY-MM-DD HH:mm:ss'),
        value: d.feeUSD ? parseFloat(d.feeUSD) ?? 0 : 0,
      }
    })
  } catch (error) {
    console.error('debug fetchChartFeeData error', error)
    return []
  }
}

export const usePoolChartFeeData = (address?: string) => {
  const chainName = useExplorerChainNameByQuery()

  return useQuery({
    queryKey: ['poolChartFeeData', chainName, address],
    queryFn: () => fetchChartFeeData(address!, chainName!),
    enabled: !!address && !!chainName,
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
}
