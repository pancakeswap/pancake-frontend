import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { isAddress } from 'utils'
import { fetchCollection, fetchCollections, fetchNewPBAndUpdateExisting } from './reducer'
import { State } from '../types'
import { NftToken, UserNftsState } from './types'

const MAX_GEN0_ID = 4

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
  }, [dispatch])
}

export const useFetchCollection = (collectionAddress: string) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollection(collectionAddress))
  }, [dispatch, collectionAddress])
}

// Returns a function that fetches more NFTs for specified bunny id
// as well as updating existing PB NFTs in state
// Note: PancakeBunny specific
export const useFetchByBunnyIdAndUpdate = (bunnyId: string) => {
  const dispatch = useAppDispatch()

  const { latestPancakeBunniesUpdateAt, isUpdatingPancakeBunnies } = useSelector(
    (state: State) => state.nftMarket.data.loadingState,
  )

  // Extra guard in case market data shifts
  // we don't wanna fetch same tokens multiple times
  const existingBunniesInState = useGetAllBunniesByBunnyId(bunnyId)
  const existingTokensWithBunnyId = existingBunniesInState ? existingBunniesInState.map((nft) => nft.tokenId) : []

  const allPancakeBunnies = useNftsFromCollection(pancakeBunniesAddress)
  const allExistingPBTokenIds = allPancakeBunnies ? allPancakeBunnies.map((nft) => nft.tokenId) : []

  const firstBunny = existingBunniesInState.length > 0 ? existingBunniesInState[0] : null

  // If we already have NFT with this bunny id in state - we can reuse its metadata without making API request
  const existingMetadata = useMemo(() => {
    return firstBunny
      ? {
          name: firstBunny.name,
          description: firstBunny.description,
          collection: { name: firstBunny.collectionName },
          image: firstBunny.image,
        }
      : null
  }, [firstBunny])

  // This fetches more bunnies when called
  const fetchMorePancakeBunnies = (orderDirection: 'asc' | 'desc') => {
    dispatch(
      fetchNewPBAndUpdateExisting({
        bunnyId,
        existingTokensWithBunnyId,
        allExistingPBTokenIds,
        existingMetadata,
        orderDirection,
      }),
    )
  }

  return { isUpdatingPancakeBunnies, latestPancakeBunniesUpdateAt, fetchMorePancakeBunnies }
}

export const useLoadingState = () => {
  return useSelector((state: State) => state.nftMarket.data.loadingState)
}

export const useGetCollections = () => {
  return useSelector((state: State) => state.nftMarket.data.collections)
}

export const useGetCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const collections = useGetCollections()
  return collections[checksummedCollectionAddress]
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const nfts: NftToken[] = useSelector((state: State) => state.nftMarket.data.nfts[checksummedCollectionAddress])
  return nfts
}

export const useGetAllBunniesByBunnyId = (bunnyId: string) => {
  const nfts: NftToken[] = useSelector((state: State) => state.nftMarket.data.nfts[pancakeBunniesAddress])
  return nfts ? nfts.filter((nft) => nft.attributes[0].value === bunnyId && nft.marketData.isTradable) : []
}

export const useGetNFTInitializationState = () => {
  return useSelector((state: State) => state.nftMarket.initializationState)
}

export const useUserNfts = (): UserNftsState => {
  return useSelector((state: State) => state.nftMarket.data.user)
}

export const useHasGen0Nfts = (): boolean => {
  const userNfts = useSelector((state: State) => state.nftMarket.data.user)
  return userNfts.nfts.some((nft) => nft.attributes && Number(nft.attributes[0]?.value) <= MAX_GEN0_ID)
}
