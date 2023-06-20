import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFixedStakingContract } from 'hooks/useContract'
import { getAddress } from 'viem'
import { useContractRead } from 'wagmi'
import toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { FixedStakingPool, StakedPosition } from '../type'

export function useStakedPositionsByUser(): StakedPosition[] {
  const fixedStakingContract = useFixedStakingContract()
  const { account, chainId } = useActiveWeb3React()
  const tokens = useOfficialsAndUserAddedTokens()

  const { data: userInfo } = useContractRead({
    abi: fixedStakingContract.abi,
    address: fixedStakingContract.address as `0x${string}`,
    functionName: 'getUserInfo',
    enabled: true,
    watch: true,
    chainId,
    args: [account],
  })

  return useMemo(() => {
    if (!Array.isArray(userInfo)) return []
    return userInfo[0].map((position) => ({
      ...position,
      pool: {
        ...position.pool,
        token: tokens[getAddress(position.pool.token)],
      },
    }))
  }, [tokens, userInfo])
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
        totalDeposited: fixedStakePool[10],
        maxPoolAmount: fixedStakePool[11],
        minBoostAmount: fixedStakePool[12],
      }
    })
    .filter(Boolean)
}
