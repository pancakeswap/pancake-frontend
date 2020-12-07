import { useContext } from 'react'
import { DataContext } from './DataContext'

const useDataProvider = () => {
  const { data } = useContext(DataContext)
  return data
}

const useFarmsLP = () => {
  const { data } = useContext(DataContext)
  return data.farms
}

export { useDataProvider, useFarmsLP }
