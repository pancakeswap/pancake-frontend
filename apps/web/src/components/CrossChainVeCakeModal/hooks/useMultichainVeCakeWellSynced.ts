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
): {
  isVeCakeWillSync?: boolean | null
  isLoading: boolean
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account) && Boolean(targetChainId)
  const { data, isLoading } = useQuery({
    queryKey: [account, 'veCakeSyncData', targetChainId],

    queryFn: () => {
      if (!account) throw new Error('account is required')
      return getVCakeAndProxyData(account, targetChainId!)
    },

    enabled,
    refetchInterval: FAST_INTERVAL,
    staleTime: FAST_INTERVAL,
  })
  // return { isVeCakeWillSync: false, isLoading } //  mock status
  return { isVeCakeWillSync: data, isLoading }
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
    queryChainList.map((chainId) => getVCakeAndProxyData(address, chainId)),
  )
  return {
    totalCount,
    syncedCount: (multichainIsWellSync?.filter((isSync) => isSync === true)?.length ?? 0) + 1,
  }
}

export const getVCakeAndProxyData = async (address: Address, targetChainId: ChainId): Promise<boolean | null> => {
  try {
    const targetClient = publicClient({ chainId: targetChainId })
    const bscClient = publicClient({ chainId: ChainId.BSC })

    const targetTime = Math.floor(Date.now() / 1000) + 60

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
          args: [address, BigInt(targetTime)],
        },
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [userInfo?.[2], BigInt(targetTime)],
        },
      ],
    })

    const callsResultTargetChain = await targetClient.multicall({
      contracts: [
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [address, BigInt(targetTime)],
        },
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAtTime',
          args: [userInfo?.[2] ?? '0x0000000000000000000000000000000000000000', BigInt(targetTime)],
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

    return isVeCakeWillSync
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
