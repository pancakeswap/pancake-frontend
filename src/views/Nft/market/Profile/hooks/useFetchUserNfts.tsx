import { useEffect, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useAppDispatch } from 'state'
import { fetchUserNfts } from 'state/nftMarket/reducer'
import { useGetCollections, useUserNfts } from 'state/nftMarket/hooks'
import usePreviousValue from 'hooks/usePreviousValue'
import { useProfile } from 'state/profile/hooks'
import { NftLocation, UserNftInitializationState } from 'state/nftMarket/types'
import { useWeb3React } from '@web3-react/core'

const useFetchUserNfts = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { profile, isInitialized: isProfileInitialized, isLoading: isProfileLoading } = useProfile()
  const { userNftsInitializationState } = useUserNfts()
  const collections = useGetCollections()

  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.collectionAddress

  const profileNftWithCollectionAddress = useMemo(() => {
    if (hasProfileNft) {
      return {
        tokenId: profileNftTokenId,
        collectionAddress: profileNftCollectionAddress,
        nftLocation: NftLocation.PROFILE,
      }
    }
    return null
  }, [profileNftTokenId, profileNftCollectionAddress, hasProfileNft])

  const previousProfileNftTokenId = usePreviousValue(profileNftTokenId)

  // Fetch on first load when profile fetch is resolved
  const shouldFetch =
    account &&
    userNftsInitializationState === UserNftInitializationState.UNINITIALIZED &&
    isProfileInitialized &&
    !isProfileLoading

  // Fetch on account / profile change, once profile fetch is resolved
  const hasAccountSwitched = previousProfileNftTokenId !== profileNftTokenId && !isProfileLoading && account

  useEffect(() => {
    if ((shouldFetch || hasAccountSwitched) && !isEmpty(collections)) {
      dispatch(fetchUserNfts({ account, collections, profileNftWithCollectionAddress }))
    }
  }, [
    dispatch,
    account,
    shouldFetch,
    hasAccountSwitched,
    profileNftTokenId,
    collections,
    profileNftWithCollectionAddress,
  ])
}

export default useFetchUserNfts
