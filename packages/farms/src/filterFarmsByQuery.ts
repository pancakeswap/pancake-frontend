import latinise from '@pancakeswap/utils/latinise'
import { FarmWithStakedValue } from './types'

export const filterFarmsByQuery = (farms: FarmWithStakedValue[], query: string): FarmWithStakedValue[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return farms.filter((farm: FarmWithStakedValue) => {
      const farmSymbol = latinise(farm.lpSymbol.toLowerCase())
      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart)
      })
    })
  }
  return farms
}
