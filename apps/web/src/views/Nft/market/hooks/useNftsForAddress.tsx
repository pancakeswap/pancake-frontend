import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useGetCollections } from 'state/nftMarket/hooks'
import { NftLocation, ApiCollections } from 'state/nftMarket/types'
import { Profile } from 'state/types'
import { getCompleteAccountNftData } from 'state/nftMarket/helpers'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useNftsForAddress = (account: string, profile: Profile, isProfileFetching: boolean) => {
  const { data: collections } = useGetCollections()

  const { nfts, isLoading, refresh } = useCollectionsNftsForAddress(account, profile, isProfileFetching, collections)
  return { nfts, isLoading, refresh }
}

export const useCollectionsNftsForAddress = (
  account: string,
  profile: Profile,
  isProfileFetching: boolean,
  collections: ApiCollections,
) => {
  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.collectionAddress

  const profileNftWithCollectionAddress = useMemo(() => {
    if (hasProfileNft) {
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
