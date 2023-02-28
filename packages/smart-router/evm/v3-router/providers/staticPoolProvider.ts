import { Pool, PoolProvider, PoolType } from '../types'
import { involvesCurrency } from '../utils'

export function createStaticPoolProvider(pools: Pool[]): PoolProvider {
  const defaultAllowedProtocols = [PoolType.V2, PoolType.STABLE, PoolType.V3]

  return {
    getCandidatePools: async (_a, _b, { protocols = defaultAllowedProtocols }) =>
      pools.filter((pool) => protocols.includes(pool.type)),
    getPools: async (pairs, { protocols = defaultAllowedProtocols }) => {
      const relatedPools: Pool[] = []
      for (const [currencyA, currencyB] of pairs) {
        for (const pool of pools) {
          if (involvesCurrency(pool, currencyA) && involvesCurrency(pool, currencyB) && protocols.includes(pool.type)) {
            relatedPools.push(pool)
          }
        }
      }
      return relatedPools
    },
  }
}
