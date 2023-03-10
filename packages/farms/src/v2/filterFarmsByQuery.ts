import latinise from '@pancakeswap/utils/latinise'

export const filterFarmsByQuery = <
  T extends {
    lpSymbol: string
  },
>(
  farms: T[],
  query: string,
): T[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return farms.filter((farm: T) => {
      const farmSymbol = latinise(farm.lpSymbol.toLowerCase())
      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart)
      })
    })
  }
  return farms
}
