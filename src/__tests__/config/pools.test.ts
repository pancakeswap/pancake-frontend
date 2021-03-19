import pools from 'config/constants/pools'

describe('Config pools', () => {
  it.each(pools.map((pool) => pool.sousId))('Pool #%d has an unique sousId', (sousId) => {
    const duplicates = pools.filter((p) => sousId === p.sousId)
    expect(duplicates).toHaveLength(1)
  })
  it.each(pools.map((pool) => [pool.sousId, pool.contractAddress]))(
    'Pool #%d has an unique contract address',
    (sousId, contractAddress) => {
      const duplicates = pools.filter((p) => contractAddress[56] === p.contractAddress[56])
      expect(duplicates).toHaveLength(1)
    },
  )
})
