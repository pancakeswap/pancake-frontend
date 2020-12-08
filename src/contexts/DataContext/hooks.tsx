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

const useFarmLP = (lpSymbol: string) => {
  const { data } = useContext(DataContext)
  return data.farms.find((farm) => farm.lpSymbol === lpSymbol)
}

export { useDataProvider, useFarmsLP, useFarmLP }
