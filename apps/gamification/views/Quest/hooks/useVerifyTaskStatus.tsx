import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useAuthJwtToken } from 'hooks/useAuthJwtToken'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { useAccount } from 'wagmi'

export interface SingleTaskStatus {
  taskId: string
  taskType: TaskType
  updateTimestamp: number
  completionStatus: boolean
  isOptional: boolean
}

export interface VerifyTaskStatus {
  userId: string
  questId: string
  message: null | string
  taskStatus: SingleTaskStatus[]
}

const initialData: VerifyTaskStatus = {
  userId: '',
  questId: '',
  message: null,
  taskStatus: [],
}

interface UseVerifyTaskStatus {
  questId: string
  isQuestFinished: boolean
  hasIdRegister: boolean
}

export const useVerifyTaskStatus = ({ questId, hasIdRegister, isQuestFinished }: UseVerifyTaskStatus) => {
  const { address: account } = useAccount()
  const { token } = useAuthJwtToken()

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['verify-user-task-status', account, questId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/getVerificationStatus/${account}/${questId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const result = await response.json()
        const userSocialHubData: VerifyTaskStatus = result
        return userSocialHubData
      } catch (error) {
        console.error(`Fetch user verify task status Error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && questId && hasIdRegister && token),
    refetchInterval: isQuestFinished ? false : SLOW_INTERVAL,
  })

  return {
    taskStatus: data ?? initialData,
    isFetching,
    refresh: refetch,
  }
}
