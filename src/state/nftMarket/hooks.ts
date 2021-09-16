import { useEffect } from 'react'
import find from 'lodash/find'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import slugify from 'utils/slugify'
import { ethers } from 'ethers'
import { fetchCollections, fetchNftsFromCollections } from './reducer'
import { State } from '../types'
import { UserNftsState, AskOrder, Transaction } from './types'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections('0x60935f36e4631f73f0f407e68642144e07ac7f5e'))
  }, [dispatch])
}

export const useGetCollections = () => {
  return useSelector((state: State) => state.nftMarket.data.collections)
}

export const useCollectionFromSlug = (slug: string) => {
  const collections = useGetCollections()
  return find(collections, (collection) => slugify(collection.name) === slug)
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const collections = useSelector((state: State) => state.nftMarket.data.nfts[collectionAddress])
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
