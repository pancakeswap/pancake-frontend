import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { veCakeABI } from 'config/abi/veCake'
import { FAST_INTERVAL } from 'config/constants'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useMultichainVeCakeWellSynced = (
  targetChainId: ChainId,
): {
  isVeCakeWillSync?: boolean | null
  isLoading: boolean
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account)
  const { data, isLoading } = useQuery({
    queryKey: [account, 'veCakeSyncData', targetChainId],

    queryFn: () => {
      if (!account) return undefined
      return getVCakeAndProxyData(account, targetChainId)
    },

    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: FAST_INTERVAL,
  })

  return { isVeCakeWillSync: data, isLoading }
}

export const getVCakeAndProxyData = async (address: Address, targetChainId: ChainId): Promise<boolean | null> => {
  try {
    const client = publicClient({ chainId: targetChainId })
    const targetTime = Math.floor(Date.now() / 1000) + 60

    const [{ result: userInfo }] = await client.multicall({
      contracts: [
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'getUserInfo',
          args: [address],
        },
      ],
    })
    const profileCallsResult = await client.multicall({
      contracts: [
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'balanceOfAt',
          args: [address, BigInt(targetTime)],
        },
        {
          address: getVeCakeAddress(ChainId.BSC),
          abi: veCakeABI,
          functionName: 'balanceOfAt',
          args: [userInfo?.[2] ?? '0x0000000000000000000000000000000000000000', BigInt(targetTime)],
        },
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAt',
          args: [address, BigInt(targetTime)],
        },
        {
          address: getVeCakeAddress(targetChainId),
          abi: veCakeABI,
          functionName: 'balanceOfAt',
          args: [userInfo?.[2] ?? '0x0000000000000000000000000000000000000000', BigInt(targetTime)],
        },
      ],
    })

    const [
      { result: bscBalance },
      { result: bscProxyBalance },
      { result: targetChainBalance },
      { result: targetChainProxyBalance },
    ] = profileCallsResult

    if (
      bscBalance === undefined ||
      bscProxyBalance === undefined ||
      targetChainBalance === undefined ||
      targetChainProxyBalance === undefined
    )
      return null

    console.info({ bscBalance, bscProxyBalance, targetChainBalance, targetChainProxyBalance }, 'veCakeSyncData')

    const isVeCakeWillSync = bscBalance + bscProxyBalance === targetChainBalance + targetChainProxyBalance

    return isVeCakeWillSync
  } catch (e) {
    console.error(e)
    return null
  }
}
