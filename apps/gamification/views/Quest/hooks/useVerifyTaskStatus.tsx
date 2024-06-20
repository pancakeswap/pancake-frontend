import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { useAccount } from 'wagmi'

interface VerifyTaskStatus {
  userId: string
  questId: string
  verificationStatusBySocialMedia: { [key in TaskType]: boolean }
  message: null | string
}

const initialData: VerifyTaskStatus = {
  userId: '',
  questId: '',
  verificationStatusBySocialMedia: {
    [TaskType.MAKE_A_SWAP]: false,
    [TaskType.HOLD_A_TOKEN]: false,
    [TaskType.ADD_LIQUIDITY]: false,
    [TaskType.PARTICIPATE_LOTTERY]: false,
    [TaskType.ADD_BLOG_POST]: false,
    [TaskType.MAKE_PREDICTION]: false,
    [TaskType.X_LINK_POST]: false,
    [TaskType.X_FOLLOW_ACCOUNT]: false,
    [TaskType.X_REPOST_POST]: false,
    [TaskType.TELEGRAM_JOIN_GROUP]: false,
    [TaskType.DISCORD_JOIN_SERVICE]: false,
    [TaskType.YOUTUBE_SUBSCRIBE]: false,
    [TaskType.IG_LIKE_POST]: false,
    [TaskType.IG_COMMENT_POST]: false,
    [TaskType.IG_FOLLOW_ACCOUNT]: false,
  },
  message: null,
}

export const useVerifyTaskStatus = (questId: string) => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: [account, questId, 'verify-user-task-status'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/getVerificationStatus/${account}/${questId}`,
        )
        const result = await response.json()
        const userSocialHubData: VerifyTaskStatus = result
        return userSocialHubData
        return initialData
      } catch (error) {
        console.error(`Fetch user verify task status Error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && questId),
    refetchInterval: SLOW_INTERVAL,
  })

  return {
    taskStatus: data ?? initialData,
    isFetching,
    refresh: refetch,
  }
}
