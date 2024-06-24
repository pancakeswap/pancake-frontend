import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

const initialData: SingleQuestData = {
  orgId: '',
  id: '',
  title: '',
  reward: undefined,
  startDateTime: 0,
  endDateTime: 0,
  chainId: ChainId.BSC,
  completionStatus: CompletionStatus.ONGOING,
  description: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
  task: [],
  rewardSCAddress: '',
  ownerAddress: '',
}

export const useGetQuestInfo = (questId: string) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: [questId, 'get-quest-info'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/questInfo/v1/getQuestInfo/${questId}`)
        const result = await response.json()
        const info: SingleQuestData = result
        return info
        return initialData
      } catch (error) {
        console.error(`Fetch quest info error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(questId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    quest: data ?? initialData,
    isFetching,
    refresh: refetch,
  }
}
