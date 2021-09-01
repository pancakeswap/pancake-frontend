import pools from 'config/constants/pools'
import { getSouschefContract, getSouschefV2Contract } from 'utils/contractHelpers'

// Pool 0 is special (cake pool)
// Pool 78 is a broken pool, not used, and break the tests
const idsToRemove = [0, 78]
// Test only against the last 10 farms, for performance concern
const poolsToTest = pools.filter((pool) => !idsToRemove.includes(pool.sousId)).slice(0, 10)

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
  it.each(poolsToTest.filter((pool) => pool.earningToken.symbol !== 'BNB'))(
    'Pool %p has the correct earning token',
    async (pool) => {
      const contract = getSouschefContract(pool.sousId)
      const rewardTokenAddress = await contract.rewardToken()
      expect(rewardTokenAddress.toLowerCase()).toBe(pool.earningToken.address.toLowerCase())
    },
  )
  it.each(poolsToTest.filter((pool) => pool.stakingToken.symbol !== 'BNB'))(
    'Pool %p has the correct staking token',
    async (pool) => {
      let stakingTokenAddress = null
      try {
        const contract = getSouschefV2Contract(pool.sousId)
        stakingTokenAddress = await contract.stakedToken()
      } catch (error) {
        const contract = getSouschefContract(pool.sousId)
        stakingTokenAddress = await contract.syrup()
      }

      expect(stakingTokenAddress.toLowerCase()).toBe(pool.stakingToken.address.toLowerCase())
    },
  )
})
