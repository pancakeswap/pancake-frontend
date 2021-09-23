import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { ethers } from 'ethers'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { isAddress } from 'utils'
import { fetchCollections, fetchNftsFromCollections } from './reducer'
import { State } from '../types'
import { UserNftsState, AskOrder, Transaction, PancakeBunnyNftWithTokens, TokenMarketData } from './types'

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

export const useUserActivity = (): (Transaction | AskOrder)[] => {
  const userNftState = useUserNfts()
  const {
    activity: { askOrderHistory, buyTradeHistory, sellTradeHistory },
  } = userNftState

  const allActivity = [...askOrderHistory, ...buyTradeHistory, ...sellTradeHistory]
  if (allActivity.length > 0) {
    const sortedByMostRecent = allActivity.sort((activityItem1, activityItem2) => {
      const timestamp1 = ethers.BigNumber.from(activityItem1.timestamp)
      const timestamp2 = ethers.BigNumber.from(activityItem2.timestamp)
      return timestamp2.sub(timestamp1).toNumber()
    })
    // TODO: This return is an array of different types (AskOrders & Transactions)
    // Once the UI requirements are clearer - there could be data transformation of these to return data of one type
    return sortedByMostRecent
  }
  return []
}

export const useGetLowestPricedPB = (nft: PancakeBunnyNftWithTokens): TokenMarketData => {
  const nfts = useNftsFromCollection(nft.collectionAddress)

  if (!nft.attributes) {
    return null
  }

  const bunnyId = nft.attributes.find((attribute) => attribute?.traitType === 'bunnyId')?.value
  const lowestPriceToken = nfts && nfts[bunnyId].lowestPricedToken

  return lowestPriceToken
}
