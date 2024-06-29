import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'

export interface SingleQuestData extends StateType {
  tasks: TaskConfigType[]
}

export interface SingleQuestDataError {
  error: string
}

export const useGetSingleQuestData = (id: string) => {
  const { data, refetch, isFetching, status } = useQuery<SingleQuestData | SingleQuestDataError>({
    queryKey: ['fetch-single-quest-dashboard-data', id],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/quest-info?id=${id}`, {
        method: 'GET',
      })

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
