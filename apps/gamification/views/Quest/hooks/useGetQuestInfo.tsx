import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useState } from 'react'
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
  tasks: [],
  rewardSCAddress: '',
  ownerAddress: '',
  numberOfParticipants: 0,
  needAddReward: true,
}

export const useGetQuestInfo = (questId: string) => {
  const [isError, setIsError] = useState(false)

  const { data, refetch, isFetched } = useQuery({
    queryKey: ['get-quest-info', questId],
    // eslint-disable-next-line consistent-return
    queryFn: async () => {
      try {
        setIsError(false)
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/questInfo/v1/getQuestInfo/${questId}`)
        if (!response.ok) {
          setIsError(true)
          return initialData
        }

        const result = await response.json()
        const info: SingleQuestData = result
        return info
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
    isError,
    quest: data ?? initialData,
    isFetched,
    refresh: refetch,
  }
}
