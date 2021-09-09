import { useEffect } from 'react'
import find from 'lodash/find'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import slugify from 'utils/slugify'
import { fetchCollections, fetchNftsFromCollections } from './reducer'
import { State } from '../types'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections('0x60935f36e4631f73f0f407e68642144e07ac7f5e'))
  }, [dispatch])
}

export const useCollectionFromSlug = (slug: string) => {
  const collections = useSelector((state: State) => state.nftMarket.data.collections)
  return find(collections, (collection) => slugify(collection.name) === slug)
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const collections = useSelector((state: State) => state.nftMarket.data.nfts[collectionAddress])
  return collections
}
