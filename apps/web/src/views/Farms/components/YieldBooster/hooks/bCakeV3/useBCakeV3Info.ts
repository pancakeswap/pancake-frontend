import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useBCakeFarmBoosterV3Contract, useMasterchefV3 } from 'hooks/useContract'
import _toNumber from 'lodash/toNumber'
import useSWRImmutable from 'swr/immutable'
import { useContractRead } from 'wagmi'
import { PRECISION_FACTOR, getUserMultiplier } from './multiplierAPI'
import { useUserLockedCakeStatus } from '../../../../hooks/useUserLockedCakeStatus'

export const USER_ESTIMATED_MULTIPLIER = 2

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  keepPreviousData: true,
}

export const useBakeV3farmCanBoost = (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useContractRead({
    abi: farmBoosterV3Contract.abi,
    address: farmBoosterV3Contract.address,
    chainId,
    functionName: 'whiteList',
    enabled: Boolean(chainId && farmPid),
    args: [BigInt(farmPid ?? 0)],
  })
  return { farmCanBoost: data }
}

export const useIsBoostedPool = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, mutate } = useSWRImmutable(
    chainId && tokenId && tokenId !== 'undefined' && `v3/bcake/isBoostedPool/${chainId}/${tokenId}`,
    () => farmBoosterV3Contract.read.isBoostedPool([BigInt(tokenId ?? 0)]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return { isBoosted: data?.[0], pid: Number(data?.[1]), mutate }
}

export const useUserPositionInfo = (tokenId: string) => {
  const { chainId } = useActiveChainId()
  const masterChefV3 = useMasterchefV3()
  const { data, mutate } = useSWRImmutable(
    chainId && tokenId && `v3/masterChef/userPositionInfos/${chainId}/${tokenId}`,
    () => masterChefV3.read.userPositionInfos([BigInt(tokenId)]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    data: {
      liquidity: data?.[0],
      boostLiquidity: data?.[1],
      tickLower: data?.[2],
      tickUpper: data?.[3],
      rewardGrowthInside: data?.[4],
      reward: data?.[5],
      user: data?.[6],
      pid: data?.[7],
      boostMultiplier: _toNumber(new BN(data?.[8].toString()).div(PRECISION_FACTOR).toFixed(3).toString()),
    },
    updateUserPositionInfo: mutate,
  }
}

export const useUserBoostedPoolsTokenId = () => {
  const { account, chainId } = useActiveWeb3React()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, mutate } = useSWRImmutable(
    chainId && account && `v3/bcake/userBoostedPools/${chainId}/${account}`,
    () => farmBoosterV3Contract.read.activedPositions([account]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    pids: data?.map((tokenId) => Number(tokenId)) ?? [],
    updateBoostedPoolsTokenId: mutate,
  }
}

export const useUserMultiplierBeforeBoosted = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, mutate } = useSWRImmutable(
    chainId && tokenId && `v3/bcake/userBoostedMultiplier/${chainId}/${tokenId}`,
    () => getUserMultiplier({ address: farmBoosterV3Contract.address, tokenId, chainId }),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    userMultiplierBeforeBoosted: data ?? 1,
    updatedUserMultiplierBeforeBoosted: mutate,
  }
}

export const useUserMaxBoostedPositionLimit = () => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && `v3/bcake/userMaxBoostedPositionLimit/${chainId}`,
    () => farmBoosterV3Contract.read.MAX_BOOST_POSITION(),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return Number(data)
}

export const useBCakeBoostLimitAndLockInfo = () => {
  const { locked, lockedEnd } = useUserLockedCakeStatus()
  const isLockEnd = useMemo(() => lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000), [lockedEnd])
  const maxBoostLimit = useUserMaxBoostedPositionLimit()
  const { pids } = useUserBoostedPoolsTokenId()
  const remainingCounts = useMemo(() => pids?.length ?? 0, [pids])
  const isReachedMaxBoostLimit = useMemo(() => remainingCounts >= maxBoostLimit, [remainingCounts, maxBoostLimit])

  return { locked, isLockEnd, maxBoostLimit, remainingCounts, isReachedMaxBoostLimit }
}
