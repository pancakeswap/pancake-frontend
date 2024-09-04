import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_DASHBOARD_API } from 'config/constants/endpoints'
import { FetchStatus } from 'config/constants/types'
import { useDashboardSiwe } from 'hooks/useDashboardSiwe'
import { StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useAccount } from 'wagmi'

export interface SingleQuestData extends StateType {
  tasks: TaskConfigType[]
}

export interface SingleQuestDataError {
  error: string
}

export const useGetSingleQuestData = (id: string) => {
  const { address, chainId } = useAccount()
  const { fetchWithSiweAuth } = useDashboardSiwe()

  const { data, refetch, isFetching, status } = useQuery<SingleQuestData | SingleQuestDataError>({
    queryKey: ['fetch-single-quest-dashboard-data', address, chainId, id],
    queryFn: async () => {
      if (!address || !chainId) {
        throw new Error('Unable to fetch dashboard data')
      }

      const response = await fetchWithSiweAuth(`${GAMIFICATION_PUBLIC_DASHBOARD_API}/quests/${id}`)

      if (!response.ok) {
        const errorData: SingleQuestDataError = await response.json()
        throw new Error(errorData.error)
      }

      const questData: SingleQuestData = await response.json()
      return questData
    },
    enabled: Boolean(id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    questData: data,
    isFetching,
    isFetched: status === FetchStatus.Fetched,
    refresh: refetch,
  }
}
