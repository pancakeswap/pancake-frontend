import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { State, ProfileState } from '../types'
import { fetchProfile, fetchProfileAvatar, fetchProfileUsername } from '.'

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchProfile(account))
    }
  }, [account, dispatch])
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
