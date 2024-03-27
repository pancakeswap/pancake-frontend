import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useAccount } from 'wagmi'
import { getProfile } from './getProfile'
import { GetProfileResponse } from './type'

export const useProfile = () => {
  const { address: account } = useAccount()
  const { data, status, refetch } = useQuery({
    queryKey: [account, 'profile'],

    queryFn: () => {
      if (!account) return undefined
      return getProfile(account)
    },

    enabled: Boolean(account),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { profile } = data ?? ({ profile: undefined } as GetProfileResponse)
  const isLoading = status === FetchStatus.Fetching

  return { profile, isLoading, refresh: refetch }
}
