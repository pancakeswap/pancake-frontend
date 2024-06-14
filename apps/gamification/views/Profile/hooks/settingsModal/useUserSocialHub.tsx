import { useQuery } from '@tanstack/react-query'
// import { GAMIFICATION_API } from 'config/constants/endpoints'
import { useAccount } from 'wagmi'

export interface SocialHubToSocialUserIdMapType {
  Twitter: string
  Telegram: string
  Discord: string
  Youtube: string
  Instagram: string
}

export interface UserInfo {
  userId: string
  socialHubToSocialUserIdMap: SocialHubToSocialUserIdMapType
}

const initialData: UserInfo = {
  userId: '',
  socialHubToSocialUserIdMap: {
    Twitter: '',
    Telegram: '',
    Discord: '',
    Youtube: '',
    Instagram: '',
  },
}

export const useUserSocialHub = () => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: [account, 'userSocial'],
    queryFn: async () => {
      try {
        // const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/getUserInfo/${account}`)
        // const result: GetUserInfoResponse = await response.json()
        // return result.data
        return initialData
      } catch (error) {
        console.error(`Fetch User Social Hub Error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    userInfo: data || initialData,
    isFetching,
    refresh: refetch,
  }
}
