import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { isAddress } from 'utils'
import { fetchCollections, fetchNftsFromCollections } from './reducer'
import { State } from '../types'
import { UserNftsState } from './types'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections(pancakeBunniesAddress))
  }, [dispatch])
}

export const useGetCollections = () => {
  return useSelector((state: State) => state.nftMarket.data.collections)
}

export const useGetCollection = (collectionAddress: string) => {
  const collections = useGetCollections()
  return collections[collectionAddress]
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const collections = useSelector((state: State) => state.nftMarket.data.nfts[checksummedCollectionAddress])
  return collections
}

export const useGetNFTInitializationState = () => {
  return useSelector((state: State) => state.nftMarket.initializationState)
}

export const useUserNfts = (): UserNftsState => {
  return useSelector((state: State) => state.nftMarket.data.user)
}
