import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { State, ProfileState } from '../types'
import { fetchProfile, fetchProfileAvatar, fetchProfileUsername } from '.'
import { getProfile } from './helpers'

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
  const [profileState, setProfileState] = useState({ profile: null, isFetching: false })
  useEffect(() => {
    const fetchProfileForAddress = async () => {
      setProfileState({ profile: null, isFetching: true })
      try {
        const profile = await getProfile(address)
        setProfileState({ profile, isFetching: false })
      } catch (error) {
        console.error(`Failed to fetch profile for address ${address}`, error)
        setProfileState({ profile: null, isFetching: false })
      }
    }
    if (!profileState.isFetching && !profileState.profile) {
      fetchProfileForAddress()
    }
  }, [profileState, address])
  return profileState
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
