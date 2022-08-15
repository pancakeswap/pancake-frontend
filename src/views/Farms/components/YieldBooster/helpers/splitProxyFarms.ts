import { SerializedFarmConfig } from 'config/constants/types'

interface SplitProxyFarmsResponse {
  normalFarms: SerializedFarmConfig[]
  farmsWithProxy: SerializedFarmConfig[]
}

export default function splitProxyFarms(farms: SerializedFarmConfig[]): SplitProxyFarmsResponse {
  const { normalFarms, farmsWithProxy } = farms.reduce(
    (acc, farm) => {
      if (farm.boosted) {
        return {
          ...acc,
          farmsWithProxy: [...acc.farmsWithProxy, farm],
        }
      }
      return {
        ...acc,
        normalFarms: [...acc.normalFarms, farm],
      }
    },
    { normalFarms: [], farmsWithProxy: [] },
  )

  return { normalFarms, farmsWithProxy }
}
