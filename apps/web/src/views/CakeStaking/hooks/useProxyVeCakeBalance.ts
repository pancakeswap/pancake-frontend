import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { isAddressEqual, zeroAddress } from 'viem'
import { erc20ABI, useContractRead } from 'wagmi'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalance = () => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCakeUserInfo()
  const { status, refetch, data } = useContractRead({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOf',
    abi: erc20ABI,
    args: [
      userInfo?.cakePoolProxy && isAddressEqual(userInfo?.cakePoolProxy, zeroAddress)
        ? '0x'
        : userInfo?.cakePoolProxy ?? '0x',
    ],
    watch: true,
    enabled: !!userInfo?.cakePoolProxy,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
