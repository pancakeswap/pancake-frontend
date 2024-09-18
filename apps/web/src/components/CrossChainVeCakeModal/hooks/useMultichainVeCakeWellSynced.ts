import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { veCakeABI } from 'config/abi/veCake'
import { FAST_INTERVAL } from 'config/constants'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { CROSS_CHAIN_CONFIG } from '../constants'

export const useMultichainVeCakeWellSynced = (
  targetChainId?: ChainId,
  targetTime?: number,
): {
  isLoading: boolean
  isVeCakeWillSync?: boolean | null
  bscBalance?: bigint
  bscProxyBalance?: bigint
  targetChainBalance?: bigint
  targetChainProxyBalance?: bigint
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account) && Boolean(targetChainId)
  const { data, isLoading } = useQuery({
    queryKey: [account, 'veCakeSyncData', targetChainId, targetTime],

    queryFn: () => {
      if (!account) throw new Error('account is required')
      return getVCakeAndProxyData(account, targetChainId!, targetTime)
    },

    enabled,
    refetchInterval: FAST_INTERVAL,
    staleTime: FAST_INTERVAL,
  })

  return {
    isVeCakeWillSync: data?.isVeCakeWillSync,
    bscBalance: data?.bscBalance,
    bscProxyBalance: data?.bscProxyBalance,
    targetChainBalance: data?.targetChainBalance,
    targetChainProxyBalance: data?.targetChainProxyBalance,
    isLoading,
  }
}

export const useAllMultichainSyncedCount = (): {
  totalCount?: number
  syncedCount?: number
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account)
  const { data } = useQuery({
    queryKey: [account, 'AllMultichainSyncedCount'],
    queryFn: () => {
      if (!account) throw new Error('account is required')
      return getAllMultichainSyncedCount(account)
    },
    enabled,
    refetchInterval: FAST_INTERVAL,
    staleTime: FAST_INTERVAL,
  })

  return { totalCount: data?.totalCount, syncedCount: data?.syncedCount }
}

export const getAllMultichainSyncedCount = async (
  address: Address,
): Promise<{ totalCount?: number; syncedCount?: number }> => {
  const queryChainList = Object.keys(CROSS_CHAIN_CONFIG) as unknown as ChainId[]
  const totalCount = queryChainList.length + 1 // add BSC CHAIN to count

  const multichainIsWellSync = await Promise.all(
    queryChainList.map((chainId) => getVCakeAndProxyData(address, chainId).then((data) => data?.isVeCakeWillSync)),
  )
  return {
    totalCount,
    syncedCount: (multichainIsWellSync?.filter((isSync) => isSync === true)?.length ?? 0) + 1,
  }
}

export const getVCakeAndProxyData = async (address: Address, targetChainId: ChainId, targetTime?: number) => {
  try {
    const targetClient = publicClient({ chainId: targetChainId })
    const bscClient = publicClient({ chainId: ChainId.BSC })

    const finalTargetTime = targetTime || Math.floor(Date.now() / 1000) + 60

    const [{ result: userInfo }] = await bscClient.multicall({
      contracts: [
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'getUserInfo',
          args: [address],
        },
      ],
    })

    if (!userInfo) return null

    const callsResultBsc = await bscClient.multicall({
      contracts: [
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [address, BigInt(finalTargetTime)],
        },
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [userInfo?.[2], BigInt(finalTargetTime)],
        },
      ],
    })

    const callsResultTargetChain = await targetClient.multicall({
      contracts: [
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [address, BigInt(finalTargetTime)],
        },
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [userInfo?.[2] ?? '0x0000000000000000000000000000000000000000', BigInt(finalTargetTime)],
        },
      ],
    })

    const [{ result: bscBalance }, { result: bscProxyBalance }] = callsResultBsc

    const [{ result: targetChainBalance }, { result: targetChainProxyBalance }] = callsResultTargetChain
    // console.info({ bscBalance, bscProxyBalance, targetChainBalance, targetChainProxyBalance }, 'veCakeSyncData')

    if (
      bscBalance === undefined ||
      bscProxyBalance === undefined ||
      targetChainBalance === undefined ||
      targetChainProxyBalance === undefined
    )
      return null

    const isVeCakeWillSync = bscBalance + bscProxyBalance === targetChainBalance + targetChainProxyBalance

    return { isVeCakeWillSync, bscBalance, bscProxyBalance, targetChainBalance, targetChainProxyBalance }
  } catch (e) {
    console.error(e)
    return null
  }
}

export const useStatusViewVeCakeWellSync = (
  targetChainId?: ChainId,
): {
  isVeCakeWillSync?: boolean | null
  isLoading: boolean
} => {
  const { isVeCakeWillSync, isLoading } = useMultichainVeCakeWellSynced(targetChainId)
  return { isVeCakeWillSync: isVeCakeWillSync && targetChainId !== ChainId.BSC, isLoading }
}
