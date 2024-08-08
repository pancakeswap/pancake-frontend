import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Profile } from 'hooks/useProfile/type'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'
import { getCompleteAccountNftData } from '../helpers'
import { ApiCollections, NftLocation } from '../type'
import { useGetCollections } from './useGetCollections'

interface NftsForAddressHookArgs {
  account: string
  profile?: Profile
  isProfileFetching: boolean
}

export const useNftsForAddress = ({ account, profile, isProfileFetching }: NftsForAddressHookArgs) => {
  const { data: collections } = useGetCollections()

  const { nfts, isLoading, refresh } = useCollectionsNftsForAddress({
    account,
    profile,
    isProfileFetching,
    collections,
  })
  return { nfts, isLoading, refresh }
}

export const useCollectionsNftsForAddress = ({
  account,
  profile,
  isProfileFetching,
  collections,
}: NftsForAddressHookArgs & {
  collections: ApiCollections
}) => {
  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.collectionAddress

  const profileNftWithCollectionAddress = useMemo(() => {
    if (hasProfileNft && profileNftTokenId) {
      return {
        tokenId: profileNftTokenId,
        collectionAddress: safeGetAddress(profileNftCollectionAddress)!,
        nftLocation: NftLocation.PROFILE,
      }
    }
    return undefined
  }, [profileNftTokenId, profileNftCollectionAddress, hasProfileNft])

  // @ts-ignore
  const { status, data, refetch } = useQuery({
    queryKey: [account, 'userNfts'],
    queryFn: async () =>
      getCompleteAccountNftData(safeGetAddress(account)!, collections, profileNftWithCollectionAddress),
    enabled: Boolean(!isProfileFetching && !isEmpty(collections) && isAddress(account)),
    placeholderData: keepPreviousData,
  })

  return { nfts: data ?? [], isLoading: status !== 'success', refresh: refetch }
}
