import { useActiveChainId } from 'hooks/useActiveChainId'
import useSWRImmutable from 'swr/immutable'
import { v3Clients } from 'utils/graphql'
import { fetchChartData } from '../data/protocol/chart'
import { ChartDayData } from '../types'

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
}

export const useProtocolChartData = (): ChartDayData[] | undefined => {
  const { chainId } = useActiveChainId()
  const { data: chartData } = useSWRImmutable(
    chainId && [`v3/info/protocol/updateProtocolChartData`, chainId],
    () => fetchChartData(v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return chartData?.data ?? []
}
