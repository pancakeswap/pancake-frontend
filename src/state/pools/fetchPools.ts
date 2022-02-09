import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import chunk from 'lodash/chunk'
import sousChefV2 from '../../config/abi/sousChefV2.json'
import sousChefV3 from '../../config/abi/sousChefV3.json'

const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)

const startEndBlockCalls = poolsWithEnd.flatMap((poolConfig) => {
  return [
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    },
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    },
  ]
})

export const fetchPoolsBlockLimits = async () => {
  const startEndBlockRaw = await multicall(sousChefABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const [startBlock, endBlock] = startEndBlockResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

const poolsBalanceOf = poolsConfig.map((poolConfig) => {
  return {
    address: poolConfig.stakingToken.address,
    name: 'balanceOf',
    params: [getAddress(poolConfig.contractAddress)],
  }
})

export const fetchPoolsTotalStaking = async () => {
  const poolsTotalStaked = await multicall(erc20ABI, poolsBalanceOf)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    totalStaked: new BigNumber(poolsTotalStaked[index]).toJSON(),
  }))
}

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = poolsConfig
    .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map((validPool) => {
      const contractAddress = getAddress(validPool.contractAddress)
      return ['hasUserLimit', 'poolLimitPerUser'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const poolStakingResultRaw = await multicallv2(sousChefV2, poolStakingCalls, { requireSuccess: false })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return poolStakingChunkedResultRaw.reduce((accum, stakingLimitRaw, index) => {
    const hasUserLimit = stakingLimitRaw[0]
    const stakingLimit = hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}

const poolsWithV3 = poolsConfig.filter((pool) => pool?.version === 3)

export const fetchPoolsProfileRequirement = async (): Promise<{
  [key: string]: {
    required: boolean
    thresholdPoints: BigNumber
  }
}> => {
  const poolProfileRequireCalls = poolsWithV3
    .map((validPool) => {
      const contractAddress = getAddress(validPool.contractAddress)
      return ['pancakeProfileIsRequested', 'pancakeProfileThresholdPoints'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const poolProfileRequireResultRaw = await multicallv2(sousChefV3, poolProfileRequireCalls, { requireSuccess: false })
  const chunkSize = poolProfileRequireCalls.length / poolsWithV3.length
  const poolStakingChunkedResultRaw = chunk(poolProfileRequireResultRaw.flat(), chunkSize)
  return poolStakingChunkedResultRaw.reduce((accum, poolProfileRequireRaw, index) => {
    const hasProfileRequired = poolProfileRequireRaw[0]
    const profileThresholdPoints = poolProfileRequireRaw[1]
      ? new BigNumber(poolProfileRequireRaw[1].toString())
      : BIG_ZERO
    return {
      ...accum,
      [poolsWithV3[index].sousId]: {
        required: hasProfileRequired,
        thresholdPoints: profileThresholdPoints.toJSON(),
      },
    }
  }, {})
}
