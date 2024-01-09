import { useAccount } from 'wagmi'
import { getAchievements } from 'state/achievements/helpers'
import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus } from 'config/constants/types'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { getProfile, GetProfileResponse } from './helpers'
import { Profile } from '../types'

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
  refresh: () => Promise<QueryObserverResult<GetProfileResponse>>
} => {
  const { data, status, refetch, isFetching } = useQuery([address, 'profile'], () => getProfile(address), {
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

  const { data, status, refetch } = useQuery([address, 'achievements'], () => getAchievements(address, t), {
    enabled: Boolean(address),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    achievements: data || [],
    isFetching: status === 'loading',
    refresh: refetch,
  }
}

export const useProfile = (): {
  profile?: Profile
  hasProfile: boolean
  hasActiveProfile: boolean
  isInitialized: boolean
  isLoading: boolean
  refresh: () => Promise<QueryObserverResult<GetProfileResponse | undefined>>
} => {
  const { address: account } = useAccount()
  const { data, status, refetch } = useQuery(
    [account, 'profile'],
    () => {
      if (!account) return undefined
      return getProfile(account)
    },
    {
      enabled: Boolean(account),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const { profile, hasRegistered } = data ?? ({ profile: undefined, hasRegistered: false } as GetProfileResponse)

  const isLoading = status === FetchStatus.Fetching
  const isInitialized = status === FetchStatus.Fetched || status === FetchStatus.Failed
  const hasProfile = isInitialized && hasRegistered
  const hasActiveProfile = hasProfile && profile ? profile.isActive : false

  return { profile, hasProfile, hasActiveProfile, isInitialized, isLoading, refresh: refetch }
}
