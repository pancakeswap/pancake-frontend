import useFarms from 'hooks/useFarms'
import { Farm } from 'types/farms'

const useFarm = (id: string): Farm => {
  const farms = useFarms()
  const farm = farms.find((f) => f.id === id)
  return farm
}

export default useFarm
