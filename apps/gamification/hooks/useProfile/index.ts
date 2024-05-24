import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useAccount } from 'wagmi'
import { getProfile } from './getProfile'
import { GetProfileResponse } from './type'

export const useProfile = () => {
  const { address: account } = useAccount()
  const enabled = Boolean(account)
  const { data, status, refetch } = useQuery({
    queryKey: [account, 'profile'],
    queryFn: () => {
      if (!account) return undefined
      return getProfile(account)
    },
    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { profile, hasRegistered } = data ?? ({ profile: undefined, hasRegistered: false } as GetProfileResponse)

  const isLoading = enabled && status === FetchStatus.Fetching
  const isInitialized = status === FetchStatus.Fetched || status === FetchStatus.Failed
  const hasProfile = isInitialized && hasRegistered
  const hasActiveProfile = hasProfile && profile ? profile.isActive : false

  return { profile, hasProfile, hasActiveProfile, isInitialized, isLoading, refresh: refetch }
}
