import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType } from 'views/DashboardQuests/type'
import { FetchAllPublicQuestDataResponse, PAGE_SIZE } from 'views/Quests/hooks/usePublicQuests'
import { useAccount } from 'wagmi'

export const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

interface UsePublicQuestsProps {
  chainIdList: ChainId[]
  completionStatus: CompletionStatus
}

export const useUserJoinedPublicQuests = ({ chainIdList, completionStatus }: UsePublicQuestsProps) => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: [account, completionStatus, chainIdList, 'fetch-user-all-public-quest-data'],
    queryFn: async () => {
      try {
        const url = `${GAMIFICATION_PUBLIC_API}/questInfo/v1/questInfoList`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 1,
            size: PAGE_SIZE,
            chainIdList,
            completionStatus,
            userId: account,
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
    enabled: Boolean(account && completionStatus),
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
