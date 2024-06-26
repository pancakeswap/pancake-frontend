import { useTranslation } from '@pancakeswap/localization'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { getAchievements } from 'state/achievements/helpers'
import { useAccount } from 'wagmi'
import { getProfile } from './getProfile'
import { GetProfileResponse, Profile } from './type'

export const useProfileForAddress = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  profile?: Profile
  isLoading: boolean
  isFetching: boolean
  isValidating: boolean
  refresh: () => Promise<QueryObserverResult<GetProfileResponse | null>>
} => {
  const { data, status, refetch, isFetching } = useQuery({
    queryKey: ['profile', address],
    queryFn: () => getProfile(address),
    enabled: Boolean(address),
    refetchOnMount: fetchConfiguration.revalidateIfStale,
    refetchOnWindowFocus: fetchConfiguration.revalidateOnFocus,
    refetchOnReconnect: fetchConfiguration.revalidateOnReconnect,
  })

  const { profile } = data ?? { profile: undefined }

  return {
    profile,
    isLoading: status !== FetchStatus.Fetched,
    isFetching: status === FetchStatus.Fetching,
    isValidating: isFetching,
    refresh: refetch,
  }
}

export const useAchievementsForAddress = (address: string) => {
  const { t } = useTranslation()

  const { data, status, refetch } = useQuery({
    queryKey: ['achievements', address],
    queryFn: () => getAchievements(address, t),
    enabled: Boolean(address),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    achievements: data || [],
    isFetching: status === 'pending',
    refresh: refetch,
  }
}

export const useProfile = () => {
  const { address: account } = useAccount()
  const enabled = Boolean(account)
  const { data, status, refetch } = useQuery({
    queryKey: ['profile', account],
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
