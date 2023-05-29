import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeFarmBoosterV3Contract, useMasterchefV3 } from 'hooks/useContract'
import useSWRImmutable from 'swr/immutable'
import { getUserMultiplier } from './useBoostMultiplierV3'

export const USER_ESTIMATED_MULTIPLIER = 2

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  keepPreviousData: true,
}

export const useBakeV3farmCanBoost = (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && farmPid && `v3/bcake/farmCanBoost/${chainId}/${farmPid}`,
    () => farmBoosterV3Contract.read.whiteList([BigInt(farmPid)]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
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
      boostMultiplier: Number(data?.[8] ?? 0),
    },
    updateUserPositionInfo: mutate,
  }
}

export const useUserBoostedPoolsPid = () => {
  const { account, chainId } = useActiveWeb3React()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && account && `v3/bcake/userBoostedPools/${chainId}/${account}`,
    () => farmBoosterV3Contract.read.activedPositions([account]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    pids: data?.map((pid) => Number(pid)) ?? [],
  }
}

export const useUserBoostedMultiplier = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && tokenId && `v3/bcake/userBoostedMultiplier/${chainId}/${tokenId}`,
    () => getUserMultiplier({ address: farmBoosterV3Contract.address, tokenId, chainId }),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data ?? 1
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
