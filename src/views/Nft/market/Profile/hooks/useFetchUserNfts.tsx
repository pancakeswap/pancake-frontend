import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserNfts } from 'state/nftMarket/reducer'
import { useGetCollections, useUserNfts } from 'state/nftMarket/hooks'
import usePreviousValue from 'hooks/usePreviousValue'
import { useProfile } from 'state/profile/hooks'

// We need to fetch collectibles for non-connected accounts, hence this hook accepts an account string.
const useFetchUserNfts = (account: string) => {
  const dispatch = useAppDispatch()
  const { profile, isInitialized: isProfileInitialized, isLoading: isProfileLoading } = useProfile()
  const { userNftsInitialised } = useUserNfts()
  const collections = useGetCollections()

  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.nftAddress
  const profileNftWithCollectionAddress = useMemo(() => {
    return { tokenId: profileNftTokenId, collectionAddress: profileNftCollectionAddress }
  }, [profileNftTokenId, profileNftCollectionAddress])

  const previousAccount = usePreviousValue(account)
  const previousProfileNftTokenId = usePreviousValue(profileNftTokenId)

  // Fetch on first load when profile fetch is resolved
  const shouldFetch = account && !userNftsInitialised && isProfileInitialized && !isProfileLoading

  // Fetch on account / profile change, once profile fetch is resoleved
  const hasAccountSwitched =
    (previousAccount !== account || previousProfileNftTokenId !== profileNftTokenId) && !isProfileLoading

  useEffect(() => {
    if (shouldFetch || hasAccountSwitched) {
      dispatch(fetchUserNfts({ account, profileNftWithCollectionAddress, collections }))
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
