import { ChainId } from '@pancakeswap/chains'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import chunk from 'lodash/chunk'
import fromPairs from 'lodash/fromPairs'
import { erc20Abi } from 'viem'

import { smartChefABI } from '../abis/ISmartChef'
import { sousChefABI } from '../abis/ISousChef'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { sousChefV3ABI } from '../abis/ISousChefV3'
import { BSC_BLOCK_TIME, getPoolsConfig } from '../constants'
import { LegacySerializedPool, OnChainProvider, UpgradedSerializedPool } from '../types'
import { isLegacyPool, isUpgradedPool } from '../utils'

const getLivePoolsWithEnd = async (chainId: ChainId) => {
  const poolsConfig = await getPoolsConfig(chainId)
  if (!poolsConfig) {
    return null
  }
  return poolsConfig.filter((p) => p.sousId !== 0 && !p.isFinished)
}

async function fetchUpgradedPoolsTimeLimits(
  pools: UpgradedSerializedPool[],
  chainId: ChainId,
  provider: OnChainProvider,
) {
  if (!pools.length) {
    return []
  }

  const calls = pools.flatMap(({ contractAddress }) => {
    return [
      {
        abi: smartChefABI,
        address: contractAddress,
        functionName: 'startTimestamp',
      },
      {
        abi: smartChefABI,
        address: contractAddress,
        functionName: 'endTimestamp',
      },
    ] as const
  })

  const client = provider({ chainId })
  const startEndRaw = await client.multicall({
    contracts: calls,
    allowFailure: false,
  })

  const startEndResult = startEndRaw.reduce<bigint[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return pools.map((cakePoolConfig, index) => {
    const [startTimestamp, endTimestamp] = startEndResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startTimestamp: Number(startTimestamp),
      endTimestamp: Number(endTimestamp),
    }
  })
}

const fetchLegacyPoolsBlockLimits = async (
  pools: LegacySerializedPool[],
  chainId: ChainId,
  provider: OnChainProvider,
) => {
  if (!pools.length) {
    return []
  }
  const startEndBlockCalls = pools.flatMap(({ contractAddress }) => {
    return [
      {
        abi: sousChefABI,
        address: contractAddress,
        functionName: 'startBlock',
      },
      {
        abi: sousChefABI,
        address: contractAddress,
        functionName: 'bonusEndBlock',
      },
    ] as const
  })

  const client = provider({ chainId })

  const [block, startEndBlockRaw] = await Promise.all([
    client.getBlock({ blockTag: 'latest' }),
    client.multicall({
      contracts: startEndBlockCalls,
      allowFailure: false,
    }),
  ])

  const startEndBlockResult = startEndBlockRaw.reduce<bigint[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  const getTimestampFromBlock = (targetBlock: number) => {
    return Number(block.timestamp) + (targetBlock - Number(block.number)) * BSC_BLOCK_TIME
  }
  return pools.map((cakePoolConfig, index) => {
    const [startBlock, endBlock] = startEndBlockResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startTimestamp: getTimestampFromBlock(Number(startBlock)),
      endTimestamp: getTimestampFromBlock(Number(endBlock)),
    }
  })
}

export const fetchPoolsTimeLimits = async (chainId: ChainId, provider: OnChainProvider) => {
  const livedPools = await getLivePoolsWithEnd(chainId)
  if (!livedPools) {
    return null
  }
  const upgradedPools = livedPools.filter(isUpgradedPool)
  const legacyPools = livedPools.filter(isLegacyPool)
  const [upgradePoolLimits, legacyPoolLimits] = await Promise.all([
    fetchUpgradedPoolsTimeLimits(upgradedPools, chainId, provider),
    fetchLegacyPoolsBlockLimits(legacyPools, chainId, provider),
  ])
  return [...upgradePoolLimits, ...legacyPoolLimits]
}

export const fetchPoolsTotalStaking = async (chainId: ChainId, provider: OnChainProvider) => {
  const poolsConfig = await getPoolsConfig(chainId)
  if (!poolsConfig) {
    return null
  }
  const poolsBalanceOf = poolsConfig.map(({ contractAddress, stakingToken }) => {
    return {
      abi: erc20Abi,
      address: stakingToken.address,
      functionName: 'balanceOf',
      args: [contractAddress],
    } as const
  })

  const client = provider({ chainId })
  const poolsTotalStaked = await client.multicall({
    contracts: poolsBalanceOf,
    allowFailure: false,
  })

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    totalStaked: new BigNumber(poolsTotalStaked[index].toString()).toJSON(),
  }))
}

interface FetchingPoolsStakingLimitsParams {
  poolsWithStakingLimit: number[]
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchPoolsStakingLimitsByBlock = async ({
  poolsWithStakingLimit,
  chainId,
  provider,
}: FetchingPoolsStakingLimitsParams): Promise<{
  [key: string]: { stakingLimit: BigNumber; numberSecondsForUserLimit: number }
}> => {
  const poolsConfig = await getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`No pools found on chain ${chainId}`)
  }

  const validPools = poolsConfig
    .filter(isLegacyPool)
    .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map(({ contractAddress }) => {
      return (['hasUserLimit', 'poolLimitPerUser', 'numberBlocksForUserLimit'] as const).map(
        (method) =>
          ({
            address: contractAddress,
            functionName: method,
            abi: sousChefV2ABI,
          } as const),
      )
    })
    .flat()

  const client = provider({ chainId })

  const poolStakingResultRaw = await client.multicall({
    contracts: poolStakingCalls,
    allowFailure: true,
  })

  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0]?.result as boolean
      const stakingLimit =
        hasUserLimit && stakingLimitRaw[1].result ? new BigNumber(stakingLimitRaw[1].result.toString()) : BIG_ZERO
      const numberBlocksForUserLimit = stakingLimitRaw[2].result ? Number(stakingLimitRaw[2].result) : 0
      const numberSecondsForUserLimit = numberBlocksForUserLimit * BSC_BLOCK_TIME
      return [validPools[index].sousId, { stakingLimit, numberSecondsForUserLimit }]
    }),
  )
}

const fetchPoolsStakingLimitsByTime = async ({
  poolsWithStakingLimit,
  chainId,
  provider,
}: FetchingPoolsStakingLimitsParams): Promise<{
  [key: string]: { stakingLimit: BigNumber; numberSecondsForUserLimit: number }
}> => {
  const poolsConfig = await getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`No pools found on chain ${chainId}`)
  }

  const validPools = poolsConfig
    .filter(isUpgradedPool)
    .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map(({ contractAddress }) => {
      return (['hasUserLimit', 'poolLimitPerUser', 'numberSecondsForUserLimit'] as const).map(
        (method) =>
          ({
            abi: smartChefABI,
            address: contractAddress,
            functionName: method,
          } as const),
      )
    })
    .flat()

  const client = provider({ chainId })
  const poolStakingResultRaw = await client.multicall({
    contracts: poolStakingCalls,
    allowFailure: true,
  })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0].result
      const stakingLimit =
        hasUserLimit && stakingLimitRaw[1].result ? new BigNumber(stakingLimitRaw[1].result.toString()) : BIG_ZERO
      const numberSecondsForUserLimit = stakingLimitRaw[2].result ? Number(stakingLimitRaw[2].result) : 0
      return [validPools[index].sousId, { stakingLimit, numberSecondsForUserLimit }]
    }),
  )
}

export const fetchPoolsStakingLimits = async (
  params: FetchingPoolsStakingLimitsParams,
): Promise<{
  [key: string]: { stakingLimit: BigNumber; numberSecondsForUserLimit: number }
}> => {
  const [limitsByTime, limitsByBlock] = await Promise.all([
    fetchPoolsStakingLimitsByTime(params),
    fetchPoolsStakingLimitsByBlock(params),
  ])
  return {
    ...limitsByTime,
    ...limitsByBlock,
  }
}

export const fetchPoolsProfileRequirement = async (
  chainId: ChainId,
  provider: OnChainProvider,
): Promise<{
  [key: string]: {
    required: boolean
    thresholdPoints: string
  }
}> => {
  const poolsConfig = await getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`No pools found on chain ${chainId}`)
  }

  const livePoolsWithV3 = poolsConfig.filter(
    (pool) => (isUpgradedPool(pool) || (isLegacyPool(pool) && pool?.version === 3)) && !pool?.isFinished,
  )
  const poolProfileRequireCalls = livePoolsWithV3
    .map(({ contractAddress }) => {
      return (['pancakeProfileIsRequested', 'pancakeProfileThresholdPoints'] as const).map(
        (method) =>
          ({
            abi: sousChefV3ABI,
            address: contractAddress,
            functionName: method,
          } as const),
      )
    })
    .flat()

  const client = provider({ chainId })
  const poolProfileRequireResultRaw = await client.multicall({
    contracts: poolProfileRequireCalls,
  })

  const chunkSize = poolProfileRequireCalls.length / livePoolsWithV3.length
  const poolStakingChunkedResultRaw = chunk(poolProfileRequireResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((poolProfileRequireRaw, index) => {
      const hasProfileRequired = poolProfileRequireRaw[0].result
      const profileThresholdPoints = poolProfileRequireRaw[1].result
        ? new BigNumber(poolProfileRequireRaw[1].result.toString())
        : BIG_ZERO
      return [
        livePoolsWithV3[index].sousId,
        {
          required: !!hasProfileRequired,
          thresholdPoints: profileThresholdPoints.toJSON(),
        },
      ]
    }),
  )
}
