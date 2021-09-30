import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { isAddress } from 'utils'
import useRefresh from 'hooks/useRefresh'
import { fetchCollections, fetchNftsByBunnyId, fetchNftsFromCollections, updateNftTokensData } from './reducer'
import { State } from '../types'
import { NftToken, UserNftsState } from './types'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections(pancakeBunniesAddress))
  }, [dispatch])
}

// Returns a function that fetches more NFTs when called and puts them into redux state.
// Also returns loading flag and time of latest successful fetch
export const useFetchByBunnyId = (bunnyId: string) => {
  const dispatch = useAppDispatch()

  const isFetchingMoreNfts = useSelector((state: State) => state.nftMarket.data.isFetchingMoreNfts)
  const latestFetchAt = useSelector((state: State) => state.nftMarket.data.latestFetchAt)

  // Extra guard in case market data shifts
  // we don't wanna fetch same tokens multiple times
  const existingBunniesInState = useGetAllBunniesByBunnyId(bunnyId)
  const existingTokenIds = existingBunniesInState ? existingBunniesInState.map((nft) => nft.tokenId) : []

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

  const fetchMorePancakeBunnies = (orderDirection: 'asc' | 'desc') => {
    dispatch(fetchNftsByBunnyId({ bunnyId, existingTokenIds, existingMetadata, orderDirection }))
  }
  return { isFetchingMoreNfts, latestFetchAt, fetchMorePancakeBunnies }
}

// This hook gets all token ids stored in redux and periodically checks subgraph in case the data we have is staled
// e.g. NFT gets sold - must be changed form isTradable: true to isTradable: false
export const useUpdateNftInfo = (collectionAddress: string) => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  const lastUpdateAt = useSelector((state: State) => state.nftMarket.data.lastUpdateAt)

  const existingNfts = useNftsFromCollection(collectionAddress)

  useEffect(() => {
    const msSinceLastUpdate = Date.now() - lastUpdateAt
    const existingTokenIds = existingNfts ? existingNfts.map((nft) => nft.tokenId) : []
    if (msSinceLastUpdate > 10000) {
      dispatch(updateNftTokensData({ collectionAddress, existingTokenIds }))
    }
  }, [dispatch, fastRefresh, collectionAddress, existingNfts, lastUpdateAt])
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
