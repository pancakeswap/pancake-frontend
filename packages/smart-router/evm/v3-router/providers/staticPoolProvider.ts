import { Pool, PoolProvider } from '../types'
import { involvesCurrency } from '../utils'

export function createStaticPoolProvider(pools: Pool[]): PoolProvider {
  return {
    getCandidatePools: async () => pools,
    getPools: async (pairs) => {
      const relatedPools: Pool[] = []
      for (const [currencyA, currencyB] of pairs) {
        for (const pool of pools) {
          if (involvesCurrency(pool, currencyA) && involvesCurrency(pool, currencyB)) {
            relatedPools.push(pool)
          }
        }
      }
      return relatedPools
    },
  }
}
