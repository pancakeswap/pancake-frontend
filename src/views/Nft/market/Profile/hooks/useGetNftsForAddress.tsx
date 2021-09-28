import { useEffect, useMemo, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useGetCollections } from 'state/nftMarket/hooks'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { Profile } from 'state/types'
import { getCompleteAccountNftData } from 'state/nftMarket/helpers'
import { isAddress } from 'utils'

const useFetchUserNfts = (account: string, profile: Profile, isProfileFetching: boolean) => {
  const [combinedNfts, setCombinedNfts] = useState<NftToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const collections = useGetCollections()

  //   TODO: Not certain this is solving the problem
  const isAddressValid = isAddress(account) !== false

  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.nftAddress

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

  useEffect(() => {
    const getNfts = async () => {
      const completeNftData = await getCompleteAccountNftData(account, collections, profileNftWithCollectionAddress)
      setCombinedNfts(completeNftData)
      setIsLoading(false)
    }

    if (isAddressValid && !isProfileFetching && !isEmpty(collections)) {
      setIsLoading(true)
      getNfts()
    }
  }, [account, collections, isProfileFetching, isAddressValid, profileNftWithCollectionAddress])

  return { nfts: combinedNfts, isLoading }
}

export default useFetchUserNfts
