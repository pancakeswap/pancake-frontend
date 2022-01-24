import { useWeb3React } from '@web3-react/core'
import { FetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import { NftToken, TokenMarketData } from 'state/nftMarket/types'
import useSWR from 'swr'
import { useErc721CollectionContract } from '../../../../hooks/useContract'
import { useProfile } from '../../../../state/profile/hooks'

const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'

const useNftOwn = (collectionAddress: string, tokenId: string, marketData?: TokenMarketData) => {
  const { account } = useWeb3React()
  const collectionContract = useErc721CollectionContract(collectionAddress, false)
  const { isInitialized: isProfileInitialized, profile } = useProfile()
  return useSWR(
    account && isProfileInitialized && collectionContract && marketData
      ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller]
      : null,
    async () => {
      const tokenOwner = await collectionContract.ownerOf(tokenId)
      let isOwn = false
      let nftIsProfilePic = false

      if (marketData) {
        nftIsProfilePic = tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
        const nftIsOnSale = marketData ? marketData?.currentSeller !== NOT_ON_SALE_SELLER : false
        if (nftIsOnSale) {
          isOwn = marketData?.currentSeller.toLowerCase() === account.toLowerCase()
        } else if (nftIsProfilePic) {
          isOwn = true
        } else {
          isOwn = tokenOwner.toLowerCase() === account.toLowerCase()
        }
      }
      return {
        isOwn,
        nftIsProfilePic,
      }
    },
  )
}

export const useCompleteNft = (collectionAddress: string, tokenId: string) => {
  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['nft', collectionAddress, tokenId] : null,
    async () => {
      const metadata = await getNftApi(collectionAddress, tokenId)
      if (metadata) {
        const basicNft: NftToken = {
          tokenId,
          collectionAddress,
          collectionName: metadata.collection.name,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
        }
        return basicNft
      }
      return null
    },
  )

  const { data: marketData, mutate: refetchNftMarketData } = useSWR(
    collectionAddress && tokenId ? ['nft', 'marketData', collectionAddress, tokenId] : null,
    async () => {
      const marketDatas = await getNftsMarketData({ collection: collectionAddress.toLowerCase(), tokenId }, 1)
      return marketDatas[0]
    },
  )

  const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await mutate()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [mutate, refetchNftMarketData, refetchNftOwn])

  return {
    combinedNft: nft ? { ...nft, marketData } : undefined,
    isOwn: nftOwn?.isOwn || false,
    isProfilePic: nftOwn?.nftIsProfilePic || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
