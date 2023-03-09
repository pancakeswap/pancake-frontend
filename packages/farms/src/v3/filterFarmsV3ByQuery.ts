import latinise from '@pancakeswap/utils/latinise'
import { FarmV3DataWithPriceAndUserInfo } from '../types'

export const filterFarmsV3ByQuery = (
  farms: FarmV3DataWithPriceAndUserInfo[],
  query: string,
): FarmV3DataWithPriceAndUserInfo[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return farms.filter((farm: FarmV3DataWithPriceAndUserInfo) => {
      const farmSymbol = latinise(farm.lpSymbol.toLowerCase())
      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart)
      })
    })
  }
  return farms
}
