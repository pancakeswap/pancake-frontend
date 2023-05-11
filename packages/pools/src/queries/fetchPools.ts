import BigNumber from 'bignumber.js'
import fromPairs from 'lodash/fromPairs'
import chunk from 'lodash/chunk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createMulticall } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'

import { BSC_BLOCK_TIME, getPoolsConfig } from '../constants'
import sousChefABI from '../abis/ISousChef.json'
import erc20ABI from '../abis/IERC20.json'
import sousChefV2 from '../abis/ISousChefV2.json'
import sousChefV3 from '../abis/ISousChefV3.json'
import smartChefABI from '../abis/ISmartChef.json'
import { LegacySerializedPool, OnChainProvider, UpgradedSerializedPool } from '../types'
import { isLegacyPool, isUpgradedPool } from '../utils'

const getLivePoolsWithEnd = async (chainId: ChainId) => {
  const poolsConfig = getPoolsConfig(chainId)
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
        address: contractAddress,
        name: 'startTimestamp',
      },
      {
        address: contractAddress,
        name: 'endTimestamp',
      },
    ]
  })

  const { multicall } = createMulticall(provider)
  const startEndRaw: [BigNumber][] = await multicall(smartChefABI, calls, chainId)

  const startEndResult = startEndRaw.reduce<[BigNumber][][]>((resultArray, item, index) => {
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
        address: contractAddress,
        name: 'startBlock',
      },
      {
        address: contractAddress,
        name: 'bonusEndBlock',
      },
    ]
  })

  const { multicall } = createMulticall(provider)
  const [block, startEndBlockRaw] = await Promise.all([
    provider({ chainId }).getBlock({ blockTag: 'latest' }),
    multicall(sousChefABI, startEndBlockCalls, chainId),
  ])

  const startEndBlockResult = (startEndBlockRaw as [bigint][]).reduce<[bigint][][]>((resultArray, item, index) => {
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
  const poolsConfig = getPoolsConfig(chainId)
  if (!poolsConfig) {
    return null
  }
  const poolsBalanceOf = poolsConfig.map(({ contractAddress, stakingToken }) => {
    return {
      address: stakingToken.address,
      name: 'balanceOf',
      params: [contractAddress],
    }
  })

  const { multicall } = createMulticall(provider)
  const poolsTotalStaked = await multicall(erc20ABI, poolsBalanceOf, chainId)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    totalStaked: new BigNumber(poolsTotalStaked[index]).toJSON(),
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
  const poolsConfig = getPoolsConfig(chainId)
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
      return ['hasUserLimit', 'poolLimitPerUser', 'numberBlocksForUserLimit'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const { multicallv2 } = createMulticall(provider)
  const poolStakingResultRaw = await multicallv2({
    chainId,
    abi: sousChefV2,
    calls: poolStakingCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    (poolStakingChunkedResultRaw as { result: any }[][]).map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0]?.result
      const stakingLimit =
        hasUserLimit && stakingLimitRaw[1].result ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
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
  const poolsConfig = getPoolsConfig(chainId)
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
      return ['hasUserLimit', 'poolLimitPerUser', 'numberSecondsForUserLimit'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const { multicallv2 } = createMulticall(provider)
  const poolStakingResultRaw = await multicallv2({
    chainId,
    abi: smartChefABI,
    calls: poolStakingCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    (poolStakingChunkedResultRaw as { result: any }[][]).map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0].result
      const stakingLimit =
        hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].result.toString()) : BIG_ZERO
      const numberSecondsForUserLimit = stakingLimitRaw[2] ? Number(stakingLimitRaw[2].result) : 0
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
  const poolsConfig = getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`No pools found on chain ${chainId}`)
  }

  const livePoolsWithV3 = poolsConfig.filter(
    (pool) => (isUpgradedPool(pool) || (isLegacyPool(pool) && pool?.version === 3)) && !pool?.isFinished,
  )
  const poolProfileRequireCalls = livePoolsWithV3
    .map(({ contractAddress }) => {
      return ['pancakeProfileIsRequested', 'pancakeProfileThresholdPoints'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const { multicallv2 } = createMulticall(provider)
  const poolProfileRequireResultRaw = await multicallv2({
    chainId,
    abi: sousChefV3,
    calls: poolProfileRequireCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolProfileRequireCalls.length / livePoolsWithV3.length
  const poolStakingChunkedResultRaw = chunk(poolProfileRequireResultRaw.flat(), chunkSize)
  return fromPairs(
    (poolStakingChunkedResultRaw as { result: any }[][]).map((poolProfileRequireRaw, index) => {
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
