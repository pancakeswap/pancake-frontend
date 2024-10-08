import { getPoolsConfig, isLegacyPool, LegacySerializedPoolConfig, SUPPORTED_CHAIN_IDS } from '@pancakeswap/pools'
import { SerializedWrappedToken } from '@pancakeswap/token-lists'
import { Pool } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { transformPool, transformUserData } from 'state/pools/helpers'
import { SerializedPool } from 'state/types'

describe('transformUserData', () => {
  it.each([
    [
      {
        allowance: new BigNumber(0),
        stakingTokenBalance: new BigNumber(0),
        stakedBalance: new BigNumber(0),
        pendingReward: new BigNumber(0),
      },
      {
        allowance: 0,
        stakingTokenBalance: 0,
        stakedBalance: 0,
        pendingReward: 0,
      },
      {
        allowance: '0',
        stakingTokenBalance: '0',
        stakedBalance: '0',
        pendingReward: '0',
      },
      {
        allowance: '0',
        stakingTokenBalance: '0',
      },
      {},
      {
        randomKey: 1,
      },
    ],
  ])('transforms user data correctly', (value) => {
    const userData = transformUserData(value)

    Object.values(userData).forEach((userDataValue) => {
      expect(userDataValue).toBeInstanceOf(BigNumber)
    })

    expect(userData).toHaveProperty('allowance')
    expect(userData).toHaveProperty('stakingTokenBalance')
    expect(userData).toHaveProperty('stakedBalance')
    expect(userData).toHaveProperty('pendingReward')
  })
})

describe('transformPool', async () => {
  const poolsConfigs = await Promise.all(SUPPORTED_CHAIN_IDS.map((chainId) => getPoolsConfig(chainId)))

  for (const poolsConfig of poolsConfigs) {
    // Transform pool object with the sous id for a label. For display purposes only.
    const poolTable: [
      number,
      Pool.SerializedPoolConfig<SerializedWrappedToken> | LegacySerializedPoolConfig<SerializedWrappedToken>,
    ][] = poolsConfig?.map((poolsConfigItem) => [poolsConfigItem.sousId, poolsConfigItem]) || []
    it.each(poolTable)('transforms pool %d correctly', (sousId, config) => {
      const pool = {
        ...config,
        totalStaked: '10',
        stakingLimit: '10',
        startTimestamp: 100,
        endTimestamp: 100,
        userData: {
          allowance: '0',
          stakingTokenBalance: '0',
          stakedBalance: '0',
          pendingReward: '0',
        },
        numberSecondsForUserLimit: 0,
      } as SerializedPool
      const transformedPool = transformPool(pool)

      expect(transformedPool).toHaveProperty('sousId', sousId)
      expect(transformedPool).toHaveProperty('contractAddress')
      expect(transformedPool).toHaveProperty('stakingToken.symbol')
      expect(transformedPool).toHaveProperty('stakingToken.projectLink')
      expect(transformedPool).toHaveProperty('earningToken.symbol')
      expect(transformedPool).toHaveProperty('earningToken.projectLink')
      expect(transformedPool).toHaveProperty('poolCategory')
      if (isLegacyPool(pool)) {
        expect(transformedPool).toHaveProperty('tokenPerBlock')
      } else {
        expect(transformedPool).toHaveProperty('tokenPerSecond')
      }

      expect(transformedPool).toHaveProperty('totalStaked')
      expect(transformedPool).toHaveProperty('stakingLimit')
      expect(transformedPool).toHaveProperty('startTimestamp', 100)
      expect(transformedPool).toHaveProperty('endTimestamp', 100)
      expect(transformedPool).toHaveProperty('userData')
    })
  }
})
