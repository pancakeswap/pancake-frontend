import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { FAKE_TOKEN } from 'views/DashboardQuestEdit/utils/FAKE_TOKEN'
import { AllDashboardQuestsType } from 'views/DashboardQuests/type'
import { useAccount } from 'wagmi'

export interface UseFetchAllQuestsProps {
  completionStatus: CompletionStatus
}

const PAGE_SIZE = 100

const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0 },
}

export const useFetchAllQuests = ({ completionStatus }) => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: [account, completionStatus, 'fetch-all-quest-dashboard-data'],
    queryFn: async () => {
      try {
        const url = `${GAMIFICATION_API}/quests/org/${account?.toLowerCase()}?completionStatus=${completionStatus}&chainId=56&page=1&pageSize=${PAGE_SIZE}`
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-secure-token': FAKE_TOKEN },
        })
        const result = await response.json()
        const questsData: AllDashboardQuestsType = result
        return questsData
      } catch (error) {
        console.error(`Fetch All quest dashboard data error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && completionStatus),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    questsData: data || initialData,
    isFetching,
    refresh: refetch,
  }
}
