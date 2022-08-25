import { SerializedFarmConfig } from 'config/constants/types'
import groupBy from 'lodash/groupBy'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'

interface SplitProxyFarmsResponse {
  normalFarms: SerializedFarmConfig[]
  farmsWithProxy: SerializedFarmConfig[]
}

export default function splitProxyFarms(farms: SerializedFarmConfig[]): SplitProxyFarmsResponse {
  const { false: normalFarms, true: farmsWithProxy } = groupBy(farms, (farm) =>
    isUndefinedOrNull(farm.boosted) ? false : farm.boosted,
  )

  return { normalFarms, farmsWithProxy }
}
