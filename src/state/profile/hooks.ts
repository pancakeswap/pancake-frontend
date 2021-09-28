import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import usePreviousValue from 'hooks/usePreviousValue'
import { getAchievements } from 'state/achievements/helpers'
import { State, ProfileState, Achievement } from '../types'
import { fetchProfile, fetchProfileAvatar, fetchProfileUsername } from '.'
import { getProfile, GetProfileResponse } from './helpers'

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchProfile(account))
    }
  }, [account, dispatch])
}

export const useProfileForAddress = (address: string) => {
  const [profileState, setProfileState] = useState<{ profile: GetProfileResponse; isFetching: boolean }>({
    profile: null,
    isFetching: true,
  })
  const previousAddress = usePreviousValue(address)
  const hasAddressChanged = previousAddress !== address

  useEffect(() => {
    const fetchProfileForAddress = async () => {
      try {
        const profile = await getProfile(address)
        setProfileState({ profile, isFetching: false })
      } catch (error) {
        console.error(`Failed to fetch profile for address ${address}`, error)
        setProfileState({ profile: null, isFetching: false })
      }
    }
    if (hasAddressChanged || (!profileState.isFetching && !profileState.profile)) {
      fetchProfileForAddress()
    }
  }, [profileState, address, hasAddressChanged])

  // Clear state on account switch
  useEffect(() => {
    setProfileState({ profile: null, isFetching: true })
  }, [address])

  return profileState
}

export const useAchievementsForAddress = (address: string) => {
  const [state, setState] = useState<{ achievements: Achievement[]; isFetching: boolean }>({
    achievements: [],
    isFetching: false,
  })
  const previousAddress = usePreviousValue(address)
  const hasAddressChanged = previousAddress !== address

  useEffect(() => {
    const fetchProfileForAddress = async () => {
      setState({ achievements: [], isFetching: true })
      try {
        const achievements = await getAchievements(address)
        setState({ achievements, isFetching: false })
      } catch (error) {
        console.error(`Failed to fetch achievements for address ${address}`, error)
        setState({ achievements: [], isFetching: false })
      }
    }
    if (hasAddressChanged || (!state.isFetching && !state.achievements)) {
      fetchProfileForAddress()
    }
  }, [state, address, hasAddressChanged])

  // Clear state on account switch
  useEffect(() => {
    setState({ achievements: [], isFetching: true })
  }, [address])

  return state
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

export const useGetProfileAvatar = (account: string) => {
  const profileAvatar = useSelector((state: State) => state.profile.profileAvatars[account])
  const { username, nft } = profileAvatar || {}
  const dispatch = useAppDispatch()

  useEffect(() => {
    const address = isAddress(account)

    if (!nft && address) {
      dispatch(fetchProfileAvatar(account))
    }

    if (!username && nft && address) {
      dispatch(fetchProfileUsername(account))
    }
  }, [account, nft, username, dispatch])

  return { username, nft }
}
