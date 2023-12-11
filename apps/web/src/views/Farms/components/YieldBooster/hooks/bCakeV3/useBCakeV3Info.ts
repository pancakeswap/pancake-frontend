import { bCakeSupportedChainId } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import BN from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBCakeFarmBoosterVeCakeContract, useMasterchefV3 } from 'hooks/useContract'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakeLockStatus } from 'views/CakeStaking/types'
import { useContractRead } from 'wagmi'
import { PRECISION_FACTOR, getUserMultiplier } from './multiplierAPI'

export const USER_ESTIMATED_MULTIPLIER = 2

const QUERY_SETTINGS_WITHOUT_REFETCH = {
  retry: 3,
  retryDelay: 3000,
  keepPreviousData: true,
}

export const useBakeV3farmCanBoost = (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterVeCakeContract()
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
  const farmBoosterV3Contract = useBCakeFarmBoosterVeCakeContract()
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
    () => masterChefV3?.read.userPositionInfos([BigInt(tokenId)]),
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
      boostMultiplier: _toNumber(new BN(data?.[8]?.toString() ?? 0).div(PRECISION_FACTOR).toString()),
    },
    updateUserPositionInfo: refetch,
  }
}

export const useUserBoostedPoolsTokenId = () => {
  const { account, chainId } = useAccountActiveChain()
  const farmBoosterV3Contract = useBCakeFarmBoosterVeCakeContract()
  const { data, refetch } = useQuery(
    [`v3/bcake/userBoostedPools/${chainId}/${account}`],
    () => farmBoosterV3Contract.read.activedPositions([account ?? '0x']),
    {
      enabled: Boolean(chainId && account),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return {
    tokenIds: data?.map((tokenId) => Number(tokenId)) ?? [],
    updateBoostedPoolsTokenId: refetch,
  }
}

export const useUserMultiplierBeforeBoosted = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterVeCakeContract()
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

export const useVeCakeUserMultiplierBeforeBoosted = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterVeCakeContract()
  const { data, refetch } = useQuery(
    [`v3/bcake/useUserMultiplierBeforeBoosted/${chainId}/${tokenId}`],
    () => getUserMultiplier({ address: farmBoosterV3Contract.address, tokenId, chainId }),
    {
      enabled: Boolean(chainId && tokenId),
      ...QUERY_SETTINGS_WITHOUT_REFETCH,
    },
  )
  return {
    veCakeUserMultiplierBeforeBoosted: data ?? 1,
    updatedUserMultiplierBeforeBoosted: refetch,
  }
}

export const useBCakeBoostLimitAndLockInfo = () => {
  const { status } = useCakeLockStatus()
  const isLockEnd = useMemo(() => status === CakeLockStatus.Expired, [status])
  const locked = useMemo(() => status === CakeLockStatus.Locking, [status])

  return { locked, isLockEnd }
}
