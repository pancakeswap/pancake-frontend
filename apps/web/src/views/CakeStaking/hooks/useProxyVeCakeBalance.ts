import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useReadContract } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { isAddressEqual } from 'utils'
import { Address, erc20Abi, zeroAddress } from 'viem'
import { CakePoolType } from '../types'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalance = () => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCakeUserInfo()

  const hasProxy = useMemo(() => {
    const delegated = userInfo?.cakePoolType === CakePoolType.DELEGATED
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress) && !delegated
  }, [userInfo])

  const { status, refetch, data } = useReadContract({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOf',
    abi: erc20Abi,
    args: [userInfo?.cakePoolProxy as Address],
    query: {
      enabled: hasProxy,
    },
    watch: true,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
