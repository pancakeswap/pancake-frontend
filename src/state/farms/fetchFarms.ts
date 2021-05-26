import { FarmConfig } from 'config/constants/types'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const { pid, lpAddresses, token, quoteToken } = farmConfig
      const publicFarmData = await fetchPublicFarmData(pid, lpAddresses, token, quoteToken)

      return {
        ...farmConfig,
        ...publicFarmData,
      }
    }),
  )
  return data
}

export default fetchFarms
