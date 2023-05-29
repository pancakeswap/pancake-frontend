import { useMemo, useRef } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useGetCollections } from 'state/nftMarket/hooks'
import { NftLocation, ApiCollections } from 'state/nftMarket/types'
import { Profile } from 'state/types'
import { getCompleteAccountNftData } from 'state/nftMarket/helpers'
import useSWR from 'swr'
import { FetchStatus } from 'config/constants/types'
import { usePreviousValue } from '@pancakeswap/hooks'
import { isAddress } from 'utils'
import { getAddress } from 'viem'

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
  const resetLaggyRef = useRef(null)
  const previousAccount = usePreviousValue(account)

  if (resetLaggyRef.current && previousAccount !== account) {
    resetLaggyRef.current()
  }
  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.collectionAddress

  const profileNftWithCollectionAddress = useMemo(() => {
    if (hasProfileNft) {
      return {
        tokenId: profileNftTokenId,
        collectionAddress: getAddress(profileNftCollectionAddress),
        nftLocation: NftLocation.PROFILE,
      }
    }
    return null
  }, [profileNftTokenId, profileNftCollectionAddress, hasProfileNft])

  // @ts-ignore
  const { status, data, mutate, resetLaggy } = useSWR(
    !isProfileFetching && !isEmpty(collections) && isAddress(account) ? [account, 'userNfts'] : null,
    async () => getCompleteAccountNftData(getAddress(account), collections, profileNftWithCollectionAddress),
    {
      keepPreviousData: true,
    },
  )

  resetLaggyRef.current = resetLaggy

  return { nfts: data ?? [], isLoading: status !== FetchStatus.Fetched, refresh: mutate }
}
