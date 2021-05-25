import { FarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(farmsToFetch.map(fetchFarm))
  return data
}

export default fetchFarms
