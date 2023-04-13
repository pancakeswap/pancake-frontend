import BigNumber from 'bignumber.js'
import fromPairs from 'lodash/fromPairs'
import chunk from 'lodash/chunk'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createMulticall } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'

import { getPoolsConfig } from '../constants'
import sousChefABI from '../abis/ISousChef.json'
import erc20ABI from '../abis/IERC20.json'
import sousChefV2 from '../abis/ISousChefV2.json'
import sousChefV3 from '../abis/ISousChefV3.json'
import { OnChainProvider } from '../types'

const getLivePoolsWithEnd = async (chainId: ChainId) => {
  const poolsConfig = getPoolsConfig(chainId)
  if (!poolsConfig) {
    return null
  }
  return poolsConfig.filter((p) => p.sousId !== 0 && !p.isFinished)
}

export const fetchPoolsBlockLimits = async (chainId: ChainId, provider: OnChainProvider) => {
  const livePoolsWithEnd = await getLivePoolsWithEnd(chainId)
  if (!livePoolsWithEnd) {
    return null
  }
  const startEndBlockCalls = livePoolsWithEnd.flatMap(({ contractAddress }) => {
    return [
      {
        address: contractAddress[chainId],
        name: 'startBlock',
      },
      {
        address: contractAddress[chainId],
        name: 'bonusEndBlock',
      },
    ]
  })

  const { multicall } = createMulticall(provider)
  const startEndBlockRaw: [BigNumber][] = await multicall(sousChefABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce<[BigNumber][][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return livePoolsWithEnd.map((cakePoolConfig, index) => {
    const [[startBlock], [endBlock]] = startEndBlockResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: startBlock.toNumber(),
      endBlock: endBlock.toNumber(),
    }
  })
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
      params: [contractAddress[chainId]],
    }
  })

  const { multicall } = createMulticall(provider)
  const poolsTotalStaked = await multicall(erc20ABI, poolsBalanceOf)

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

export const fetchPoolsStakingLimits = async ({
  poolsWithStakingLimit,
  chainId,
  provider,
}: FetchingPoolsStakingLimitsParams): Promise<{
  [key: string]: { stakingLimit: BigNumber; numberBlocksForUserLimit: number }
}> => {
  const poolsConfig = getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`No pools found on chain ${chainId}`)
  }

  const validPools = poolsConfig
    .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map(({ contractAddress }) => {
      return ['hasUserLimit', 'poolLimitPerUser', 'numberBlocksForUserLimit'].map((method) => ({
        address: contractAddress[chainId],
        name: method,
      }))
    })
    .flat()

  const { multicallv2 } = createMulticall(provider)
  const poolStakingResultRaw = await multicallv2({
    abi: sousChefV2,
    calls: poolStakingCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0]
      const stakingLimit = hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
      const numberBlocksForUserLimit = stakingLimitRaw[2] ? (stakingLimitRaw[2] as EthersBigNumber).toNumber() : 0
      return [validPools[index].sousId, { stakingLimit, numberBlocksForUserLimit }]
    }),
  )
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

  const livePoolsWithV3 = poolsConfig.filter((pool) => pool?.version === 3 && !pool?.isFinished)
  const poolProfileRequireCalls = livePoolsWithV3
    .map(({ contractAddress }) => {
      return ['pancakeProfileIsRequested', 'pancakeProfileThresholdPoints'].map((method) => ({
        address: contractAddress[chainId],
        name: method,
      }))
    })
    .flat()

  const { multicallv2 } = createMulticall(provider)
  const poolProfileRequireResultRaw = await multicallv2({
    abi: sousChefV3,
    calls: poolProfileRequireCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolProfileRequireCalls.length / livePoolsWithV3.length
  const poolStakingChunkedResultRaw = chunk(poolProfileRequireResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((poolProfileRequireRaw, index) => {
      const hasProfileRequired = poolProfileRequireRaw[0]
      const profileThresholdPoints = poolProfileRequireRaw[1]
        ? new BigNumber(poolProfileRequireRaw[1].toString())
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
