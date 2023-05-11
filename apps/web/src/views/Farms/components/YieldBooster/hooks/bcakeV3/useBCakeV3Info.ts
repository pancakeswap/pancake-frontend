import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeFarmBoosterV3Contract, useMasterchefV3 } from 'hooks/useContract'
import useSWRImmutable from 'swr/immutable'

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  keepPreviousData: true,
}

export const useBakeV3farmCanBoost = async (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && farmPid && `v3/bcake/farmCanBoost/${chainId}/${farmPid}`,
    () => farmBoosterV3Contract.whiteList(farmPid),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return { farmCanBoost: data }
}

export const useBakeV3INfo = async (tokenId: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && tokenId && `v3/bcake/isBoostedPool/${chainId}/${tokenId}`,
    () => farmBoosterV3Contract.isBoostedPool(tokenId),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return { isBoosted: data?.[0], pid: data?.[1].toNumber() }
}

export const useUserPositionIfo = async (tokenId: string) => {
  const { chainId } = useActiveChainId()
  const masterChefV3 = useMasterchefV3()
  const { data } = useSWRImmutable(
    chainId && tokenId && `v3/masterChef/userPositionInfos/${chainId}/${tokenId}`,
    () => masterChefV3.userPositionInfos(tokenId),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    liquidity: data?.[0],
    boostLiquidity: data?.[1],
    tickLower: data?.[2],
    tickUpper: data?.[3],
    rewardGrowthInside: data?.[4],
    reward: data?.[5],
    user: data?.[6],
    pid: data?.[7],
    boostMultiplier: data?.[8]?.toNumber(),
  }
}

export const useUserBoostedPoolsPid = async () => {
  const { account, chainId } = useActiveWeb3React()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && account && `v3/bcake/userBoostedPools/${chainId}/${account}`,
    () => farmBoosterV3Contract.activedPositions(account),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    pids: data?.map((pid: any) => pid.toNumber()),
  }
}

export const useUserBoostedMultiplier = async (tokenId: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && tokenId && `v3/bcake/userBoostedMultiplier/${chainId}/${tokenId}`,
    () => farmBoosterV3Contract.getUserMultiplier(tokenId),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.toNumber()
}

export const useUserMaxBoostedPositionLimit = async () => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && `v3/bcake/userMaxBoostedPositionLimit/${chainId}`,
    () => farmBoosterV3Contract.MAX_BOOST_POSITION(),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.toNumber()
}
