import { ApiResponseCollectionTokens } from 'state/nftMarket/types'

type sortBuilder = {
  data: ApiResponseCollectionTokens
  raritySort: string
}

export const sortBunniesByRarityBuilder =
  ({ raritySort, data }: sortBuilder) =>
  (bunnyIdA, bunnyIdB) => {
    const bunnyCountA = data.attributesDistribution[bunnyIdA] ?? 0
    const bunnyCountB = data.attributesDistribution[bunnyIdB] ?? 0

    return raritySort === 'asc' ? bunnyCountA - bunnyCountB : bunnyCountB - bunnyCountA
  }
