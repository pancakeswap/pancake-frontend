import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { FetchStatus } from 'config/constants/types'
import { useSiwe } from 'hooks/useSiwe'
import { useAccount } from 'wagmi'

export enum SocialHubType {
  Twitter = 'Twitter',
  Telegram = 'Telegram',
  Discord = 'Discord',
  Youtube = 'Youtube',
  Instagram = 'Instagram',
}

export interface UserInfo {
  userId: null | string
  socialHubToSocialUserIdMap: null | { [key in SocialHubType]: string }
  questIds: null | Array<string>
}

const initialData: UserInfo = {
  userId: null,
  socialHubToSocialUserIdMap: null,
  questIds: null,
}

export const useUserSocialHub = () => {
  const { address: account, connector } = useAccount()
  const { fetchWithSiweAuth } = useSiwe()

  const { data, refetch, isFetching, status } = useQuery({
    queryKey: ['userSocial', account],
    queryFn: async () => {
      try {
        const response = await fetchWithSiweAuth(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/getUserInfo/${account}`)
        const result = await response.json()
        const userSocialHubData: UserInfo = result
        return userSocialHubData
      } catch (error) {
        console.error(`Fetch User Social Hub Error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && connector && typeof connector.getChainId === 'function'),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    userInfo: data || initialData,
    isFetching,
    isFetched: status === FetchStatus.Fetched,
    refresh: refetch,
  }
}
