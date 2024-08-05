import { Protocol } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { QUERY_SETTINGS_IMMUTABLE, QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH } from 'config/constants'
import dayjs from 'dayjs'
import { explorerApiClient } from 'state/info/api/client'
import { useExplorerChainNameByQuery } from 'state/info/api/hooks'
import { components } from 'state/info/api/schema'

const fetchChartFeeData = async (
  address: string,
  chainName: components['schemas']['ChainName'],
  protocol: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
  signal?: AbortSignal,
) => {
  try {
    const resp = await explorerApiClient.GET('/cached/pools/chart/{protocol}/{chainName}/{address}/fees', {
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
        time: dayjs(d.bucket as string)
          .unix()
          .toString(),
        value: d.feeUSD ? parseFloat(d.feeUSD) ?? 0 : 0,
      }
    })
  } catch (error) {
    console.error('debug fetchChartFeeData error', error)
    return []
  }
}

export const usePoolChartFeeData = (
  address?: string,
  protocol?: Protocol,
  period: components['schemas']['ChartPeriod'] = '1Y',
) => {
  const chainName = useExplorerChainNameByQuery()

  return useQuery({
    queryKey: ['poolChartFeeData', chainName, address, protocol],
    queryFn: () => fetchChartFeeData(address!, chainName!, protocol!, period),
    enabled: !!address && !!protocol && !!chainName,
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
  })
}
