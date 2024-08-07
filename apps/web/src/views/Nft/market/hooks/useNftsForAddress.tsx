import { keepPreviousData, useQuery } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'
import { getCompleteAccountNftData } from 'state/nftMarket/helpers'
import { useGetCollections } from 'state/nftMarket/hooks'
import { ApiCollections, NftLocation } from 'state/nftMarket/types'
import { Profile } from 'state/types'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'

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

  const {
    data = [],
    status,
    refetch,
  } = useQuery({
    queryKey: [account, 'userNfts'],
    queryFn: async () =>
      getCompleteAccountNftData(safeGetAddress(account)!, collections, profileNftWithCollectionAddress),
    enabled: Boolean(!isProfileFetching && !isEmpty(collections) && isAddress(account)),
    placeholderData: keepPreviousData,
  })

  return { nfts: data, isLoading: status !== 'success', refresh: refetch }
}
