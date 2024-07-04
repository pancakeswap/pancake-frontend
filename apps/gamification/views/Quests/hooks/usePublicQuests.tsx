import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType, Pagination } from 'views/DashboardQuests/type'

export const PAGE_SIZE = 100

export interface FetchAllPublicQuestDataResponse {
  data: SingleQuestData[]
  pagination: Pagination
}

export const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

interface UsePublicQuestsProps {
  chainIdList: ChainId[]
  completionStatus: CompletionStatus
}

export const usePublicQuests = ({ chainIdList, completionStatus }: UsePublicQuestsProps) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['fetch-all-public-quest-data', completionStatus, chainIdList],
    queryFn: async () => {
      try {
        if (chainIdList.length === 0) {
          return initialData
        }

        const url = `${GAMIFICATION_PUBLIC_API}/questInfo/v1/questInfoList`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 1,
            size: PAGE_SIZE,
            chainIdList,
            completionStatus,
          }),
        })
        const result = await response.json()
        const questsData: FetchAllPublicQuestDataResponse = result
        return {
          quests: questsData.data,
          pagination: questsData.pagination,
        }
      } catch (error) {
        console.error(`Fetch all public quests data error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(completionStatus),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    data: data ?? initialData,
    isFetching,
    refetch,
  }
}
