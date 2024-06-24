import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType } from 'views/DashboardQuests/type'

const PAGE_SIZE = 50

const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

interface UsePublicQuestsProps {
  chains: ChainId[]
  completionStatus: CompletionStatus
}

export const usePublicQuests = ({ chains, completionStatus }: UsePublicQuestsProps) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: [completionStatus, 'fetch-all-public-quest-data'],
    queryFn: async () => {
      try {
        const url = `${GAMIFICATION_PUBLIC_API}/questInfo/v1/questInfoList`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 1,
            size: PAGE_SIZE,
            chainId: 56,
            completionStatus,
            // userId: 123,
          }),
        })
        const result = await response.json()
        const questsData: AllDashboardQuestsType = result
        return questsData
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
