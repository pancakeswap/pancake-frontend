import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { fetchCollections, fetchNftsFromCollections } from './reducer'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections('0x60935f36e4631f73f0f407e68642144e07ac7f5e'))
  }, [dispatch])
}
