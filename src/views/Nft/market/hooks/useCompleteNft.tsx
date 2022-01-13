import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import { useProfile } from '../../../../state/profile/hooks'
import { useErc721CollectionContract } from '../../../../hooks/useContract'

const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'

export const useCompleteNft = (collectionAddress: string, tokenId: string, lastUpdated: number) => {
  const { account } = useWeb3React()
  const { isInitialized: isProfileInitialized, profile } = useProfile()
  const collectionContract = useErc721CollectionContract(collectionAddress, false)
  const [combinedNft, setCombinedNft] = useState<NftToken>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwn, setIsOwn] = useState(false)
  const [isProfilePic, setIsProfilePic] = useState(false)

  useEffect(() => {
    const getNft = async () => {
      const metadata = await getNftApi(collectionAddress, tokenId)
      const [marketData] = await getNftsMarketData({ collection: collectionAddress.toLowerCase(), tokenId }, 1)
      setCombinedNft({
        tokenId,
        collectionAddress,
        collectionName: metadata.collection.name,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        marketData,
      })
      setIsLoading(false)
    }

    const getNftWithLocation = async () => {
      const metadata = await getNftApi(collectionAddress, tokenId)
      const [marketData] = await getNftsMarketData({ collection: collectionAddress.toLowerCase(), tokenId }, 1)
      const tokenOwner = await collectionContract.ownerOf(tokenId)
      const nftIsProfilePic =
        tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      const nftIsOnSale = marketData?.currentSeller !== NOT_ON_SALE_SELLER
      const location = nftIsProfilePic ? NftLocation.PROFILE : nftIsOnSale ? NftLocation.FORSALE : NftLocation.WALLET
      if (nftIsOnSale) {
        setIsOwn(marketData?.currentSeller.toLowerCase() === account.toLowerCase())
      } else if (nftIsProfilePic) {
        setIsOwn(true)
      } else {
        setIsOwn(tokenOwner.toLowerCase() === account.toLowerCase())
      }
      setIsProfilePic(nftIsProfilePic)
      setCombinedNft({
        tokenId,
        collectionAddress,
        collectionName: metadata.collection.name,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        marketData,
        location,
      })
      setIsLoading(false)
    }

    if (account) {
      if (isProfileInitialized) {
        getNftWithLocation()
      }
    } else {
      getNft()
    }
  }, [account, isProfileInitialized, collectionAddress, tokenId, profile, collectionContract, lastUpdated])

  return {
    combinedNft,
    isOwn,
    isProfilePic,
    isLoading,
  }
}
