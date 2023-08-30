import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFixedStakingContract } from 'hooks/useContract'
import { getAddress } from 'viem'
import { useContractRead } from 'wagmi'
import toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import BigNumber from 'bignumber.js'
import { FixedStakingPool, StakedPosition } from '../type'

export function useCurrenDay(): number {
  const fixedStakingContract = useFixedStakingContract()

  const { chainId } = useActiveWeb3React()

  const { data } = useContractRead({
    abi: fixedStakingContract.abi,
    address: fixedStakingContract.address as `0x${string}`,
    functionName: 'getCurrentDay',
    enabled: true,
    watch: true,
    chainId,
  })

  return (data || 0) as number
}

export function useStakedPositionsByUser(poolIndexes: number[]): StakedPosition[] {
  const fixedStakingContract = useFixedStakingContract()
  const { account } = useActiveWeb3React()
  const tokens = useOfficialsAndUserAddedTokens()

  const results = useSingleContractMultipleData({
    contract: {
      abi: fixedStakingContract.abi,
      address: fixedStakingContract.address,
    },
    functionName: 'getUserInfo',
    args: account ? poolIndexes.map((index) => [index, account]) : [],
  })

  return useMemo(() => {
    if (!Array.isArray(results)) return []
    return results
      .map(({ result }, index) => {
        if (Array.isArray(result) && new BigNumber(result[0].userInfo.userDeposit).gt(0)) {
          const position = result[0]
          const endPoolTime = position.pool.endDay * 86400 + 43200
          const endLockTime = position.endLockTime > endPoolTime ? endPoolTime : position.endLockTime
          return {
            ...position,
            pool: {
              ...position.pool,
              poolIndex: poolIndexes[index],
              token: tokens[getAddress(position.pool.token)],
            },
            endLockTime,
          }
        }

        return undefined
      })
      .filter(Boolean)
  }, [poolIndexes, results, tokens])
}

export function useStakedPools(): FixedStakingPool[] {
  const fixedStakingContract = useFixedStakingContract()
  const tokens = useOfficialsAndUserAddedTokens()
  const { chainId } = useActiveWeb3React()

  const { data: poolLength } = useContractRead({
    abi: fixedStakingContract.abi,
    address: fixedStakingContract.address as `0x${string}`,
    functionName: 'poolLength',
    chainId,
    args: [],
  })

  const numberOfPools = poolLength ? toNumber(poolLength.toString()) : 0

  const fixedStakePools = useSingleContractMultipleData({
    contract: {
      abi: fixedStakingContract.abi,
      address: fixedStakingContract.address,
    },
    functionName: 'pools',
    args: useMemo(
      () => Array.from(Array(numberOfPools).keys()).map((index) => [BigInt(index)] as const),
      [numberOfPools],
    ),
  })

  if (!fixedStakePools?.length) return []

  return fixedStakePools
    .map(({ result: fixedStakePool }, index) => {
      if (!fixedStakePool) return null

      return {
        poolIndex: index,
        token: tokens[getAddress(fixedStakePool[0])],
        endDay: fixedStakePool[1],
        lockDayPercent: fixedStakePool[2],
        boostDayPercent: fixedStakePool[3],
        unlockDayPercent: fixedStakePool[4],
        lockPeriod: fixedStakePool[5],
        withdrawalFee: fixedStakePool[6],
        depositEnabled: fixedStakePool[7],
        maxDeposit: fixedStakePool[8],
        minDeposit: fixedStakePool[9],
        totalDeposited: new BigNumber(fixedStakePool[10]),
        maxPoolAmount: fixedStakePool[11],
        minBoostAmount: fixedStakePool[12],
      }
    })
    .filter(Boolean)
}
