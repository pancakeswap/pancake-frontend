import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'

const useFarm = (id: string): Farm => {
  const { farms } = useContext(FarmsContext)
  const farm = farms.find((f) => f.id === id)
  return farm
}

export default useFarm
