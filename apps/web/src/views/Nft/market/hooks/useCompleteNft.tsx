import { useQuery } from '@tanstack/react-query'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { FetchStatus } from 'config/constants/types'
import { useErc721CollectionContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { getCollectionApi, getNftApi, getNftsMarketData, getNftsOnChainMarketData } from 'state/nftMarket/helpers'
import { NftLocation, NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useProfile } from 'state/profile/hooks'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

const useNftOwn = (collectionAddress: Address | undefined, tokenId: string, marketData?: TokenMarketData) => {
  const { address: account } = useAccount()
  const collectionContract = useErc721CollectionContract(collectionAddress)
  const { isInitialized: isProfileInitialized, profile } = useProfile()

  const { data: tokenOwner } = useQuery({
    queryKey: ['nft', 'ownerOf', collectionAddress, tokenId],
    queryFn: async () => collectionContract?.read.ownerOf([BigInt(tokenId)]),
    enabled: Boolean(collectionAddress && tokenId),
  })

  return useQuery({
    queryKey: ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller],
    queryFn: async () => {
      const nftIsProfilePic =
        tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      const nftIsOnSale = marketData ? marketData?.currentSeller !== NOT_ON_SALE_SELLER : false
      if (nftIsOnSale) {
        return {
          isOwn: safeGetAddress(marketData?.currentSeller) === safeGetAddress(account),
          nftIsProfilePic,
          location: NftLocation.FORSALE,
        }
      }
      if (nftIsProfilePic) {
        return {
          isOwn: true,
          nftIsProfilePic,
          location: NftLocation.PROFILE,
        }
      }
      return {
        isOwn: safeGetAddress(tokenOwner) === safeGetAddress(account),
        nftIsProfilePic,
        location: NftLocation.WALLET,
      }
    },
    enabled: Boolean(account && isProfileInitialized && tokenOwner && collectionAddress && tokenId),
  })
}

export const useCompleteNft = (collectionAddress: Address | undefined, tokenId: string) => {
  const { data: nft, refetch: refetchNftMetadata } = useQuery({
    queryKey: ['nft', collectionAddress, tokenId],
    queryFn: async () => {
      const metadata = await getNftApi(collectionAddress!, tokenId)
      if (metadata) {
        const collectionMetadata = await getCollectionApi(collectionAddress!)
        const basicNft: NftToken = {
          tokenId,
          collectionAddress: collectionAddress!,
          collectionName: collectionMetadata?.name || metadata.collection.name,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
        }
        return basicNft
      }
      return null
    },
    enabled: Boolean(collectionAddress && tokenId),
  })

  const { data: marketData, refetch: refetchNftMarketData } = useQuery({
    queryKey: ['nft', 'marketData', collectionAddress, tokenId],
    queryFn: async () => {
      const [onChainMarketDatas, marketDatas] = await Promise.all([
        getNftsOnChainMarketData(collectionAddress!, [tokenId]),
        getNftsMarketData({ collection: collectionAddress?.toLowerCase(), tokenId }, 1),
      ])
      const onChainMarketData = onChainMarketDatas[0]

      if (!marketDatas[0] && !onChainMarketData) return undefined

      if (!onChainMarketData) return marketDatas[0]

      return { ...marketDatas[0], ...onChainMarketData }
    },
    enabled: Boolean(collectionAddress && tokenId),
  })

  const { data: nftOwn, refetch: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await refetchNftMetadata()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [refetchNftMetadata, refetchNftMarketData, refetchNftOwn])

  return {
    combinedNft: nft ? { ...nft, marketData, location: nftOwn?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nftOwn?.isOwn || false,
    isProfilePic: nftOwn?.nftIsProfilePic || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
