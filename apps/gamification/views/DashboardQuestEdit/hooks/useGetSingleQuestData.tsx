import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import { FetchStatus } from 'config/constants/types'
import { StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'

const FAKE_TOKEN = '"test-secret-key"'

export interface SingleQuestData extends StateType {
  task: TaskConfigType[]
}

export interface SingleQuestDataError {
  error: string
}

export const useGetSingleQuestData = (id: string) => {
  const { data, refetch, isFetching, status } = useQuery({
    queryKey: [id, 'fetch-single-quest-dashboard-data'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GAMIFICATION_API}/quests/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-secure-token': FAKE_TOKEN },
        })
        const result = await response.json()
        const questData: SingleQuestData | SingleQuestDataError = result
        return questData
      } catch (error) {
        console.error(`Fetch Single dashboard quest error: ${error}`)
        throw error
      }
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
