import { FarmConfig } from 'config/constants/types'
import { serializeToken } from 'state/user/hooks/helpers'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      // farm.token = serializeToken(farm.token)
      // farm.quoteToken = serializeToken(farm.quoteToken)
      return farm
    }),
  )
  return data
}

export default fetchFarms
