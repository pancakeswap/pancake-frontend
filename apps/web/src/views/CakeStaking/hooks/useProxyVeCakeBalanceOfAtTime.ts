import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useReadContract } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { isAddressEqual } from 'utils'
import { Address, zeroAddress } from 'viem'
import { CakePoolType } from '../types'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalanceOfAtTime = (timestamp: number) => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCakeUserInfo()

  const hasProxy = useMemo(() => {
    const delegated = userInfo?.cakePoolType === CakePoolType.DELEGATED
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress) && !delegated
  }, [userInfo])

  const { status, refetch, data } = useReadContract({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOfAtTime',
    abi: veCakeABI,
    args: [userInfo?.cakePoolProxy as Address, BigInt(timestamp)],
    query: {
      enabled: Boolean(hasProxy && timestamp),
    },
    watch: true,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
