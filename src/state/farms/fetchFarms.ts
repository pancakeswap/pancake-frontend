import { SerializedFarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      const serializedFarm = { ...farm, token: farm.token, quoteToken: farm.quoteToken }
      return serializedFarm
    }),
  )
  return data
}

export default fetchFarms
