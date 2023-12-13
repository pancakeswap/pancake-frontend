import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { bCakeSupportedChainId } from '@pancakeswap/farms'
import { useBCakeFarmBoosterV3Contract, useMasterchefV3 } from 'hooks/useContract'
import _toNumber from 'lodash/toNumber'
import { useQuery } from '@tanstack/react-query'
import { useContractRead } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { PRECISION_FACTOR, getUserMultiplier } from './multiplierAPI'
import { useUserLockedCakeStatus } from '../../../../hooks/useUserLockedCakeStatus'

export const USER_ESTIMATED_MULTIPLIER = 2

const QUERY_SETTINGS_WITHOUT_REFETCH = {
  retry: 3,
  retryDelay: 3000,
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
    enabled: Boolean(chainId && farmPid && bCakeSupportedChainId.includes(chainId)),
    args: [BigInt(farmPid ?? 0)],
  })
  return { farmCanBoost: data }
}

export const useIsBoostedPool = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, refetch } = useQuery(
    [`v3/bcake/isBoostedPool/${chainId}/${tokenId}`],
    () => farmBoosterV3Contract.read.isBoostedPool([BigInt(tokenId ?? 0)]),
    {
      enabled: Boolean(chainId && tokenId && tokenId !== 'undefined'),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return { isBoosted: data?.[0], pid: Number(data?.[1]), mutate: refetch }
}

export const useUserPositionInfo = (tokenId: string) => {
  const { chainId } = useActiveChainId()
  const masterChefV3 = useMasterchefV3()
  const { data, refetch } = useQuery(
    [`v3/masterChef/userPositionInfos/${chainId}/${tokenId}`],
    () => masterChefV3.read.userPositionInfos([BigInt(tokenId)]),
    {
      enabled: Boolean(chainId && tokenId),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
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
      boostMultiplier: _toNumber(new BN(data?.[8].toString()).div(PRECISION_FACTOR).toString()),
    },
    updateUserPositionInfo: refetch,
  }
}

export const useUserBoostedPoolsTokenId = () => {
  const { account, chainId } = useAccountActiveChain()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, refetch } = useQuery(
    [`v3/bcake/userBoostedPools/${chainId}/${account}`],
    () => farmBoosterV3Contract.read.activedPositions([account]),
    {
      enabled: Boolean(chainId && account),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return {
    pids: data?.map((tokenId) => Number(tokenId)) ?? [],
    updateBoostedPoolsTokenId: refetch,
  }
}

export const useUserMultiplierBeforeBoosted = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data, refetch } = useQuery(
    [`v3/bcake/useUserMultiplierBeforeBoosted/${chainId}/${tokenId}`],
    () => getUserMultiplier({ address: farmBoosterV3Contract.address, tokenId, chainId }),
    {
      enabled: Boolean(chainId && tokenId),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return {
    userMultiplierBeforeBoosted: data ?? 1,
    updatedUserMultiplierBeforeBoosted: refetch,
  }
}

export const useUserMaxBoostedPositionLimit = () => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useQuery(
    [`v3/bcake/userMaxBoostedPositionLimit/${chainId}`],
    () => farmBoosterV3Contract.read.MAX_BOOST_POSITION(),
    {
      enabled: Boolean(chainId),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return Number(data)
}

export const useBCakeBoostLimitAndLockInfo = () => {
  const { locked, lockedEnd } = useUserLockedCakeStatus()
  const isLockEnd = useMemo(() => lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000), [lockedEnd])
  const maxBoostLimit = useUserMaxBoostedPositionLimit()
  const { pids } = useUserBoostedPoolsTokenId()
  const remainingCounts = useMemo(() => maxBoostLimit - (pids?.length ?? 0), [pids, maxBoostLimit])
  const isReachedMaxBoostLimit = useMemo(() => remainingCounts <= 0, [remainingCounts])
  return { locked, isLockEnd, maxBoostLimit, remainingCounts, isReachedMaxBoostLimit }
}
