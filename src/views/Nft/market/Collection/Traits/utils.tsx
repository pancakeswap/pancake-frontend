import { ApiResponseCollectionTokens } from 'state/nftMarket/types'

type sortBuilder = {
  data: ApiResponseCollectionTokens
  rarirySort: string
}

export const sortBunniesByRarirityBuilder =
  ({ rarirySort, data }: sortBuilder) =>
  (bunnyIdA, bunnyIdB) => {
    const bunnyCountA = data.attributesDistribution[bunnyIdA] ?? 0
    const bunnyCountB = data.attributesDistribution[bunnyIdB] ?? 0

    return rarirySort === 'asc' ? bunnyCountA - bunnyCountB : bunnyCountB - bunnyCountA
  }
