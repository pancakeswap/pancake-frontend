import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { useAccount } from 'wagmi'

export interface VerifyTaskStatus {
  userId: string
  questId: string
  verificationStatusBySocialMedia: null | { [key in TaskType]: boolean }
  message: null | string
}

const initialData: VerifyTaskStatus = {
  userId: '',
  questId: '',
  verificationStatusBySocialMedia: null,
  message: null,
}

interface UseVerifyTaskStatus {
  questId: string
  isQuestFinished: boolean
}

export const useVerifyTaskStatus = ({ questId, isQuestFinished }: UseVerifyTaskStatus) => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['verify-user-task-status', account, questId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/getVerificationStatus/${account}/${questId}`,
        )
        const result = await response.json()
        const userSocialHubData: VerifyTaskStatus = result
        return userSocialHubData
      } catch (error) {
        console.error(`Fetch user verify task status Error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && questId),
    refetchInterval: isQuestFinished ? false : SLOW_INTERVAL,
  })

  return {
    taskStatus: data ?? initialData,
    isFetching,
    refresh: refetch,
  }
}
