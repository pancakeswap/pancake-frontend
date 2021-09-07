import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { fetchCollections } from './reducer'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
  }, [dispatch])
}
