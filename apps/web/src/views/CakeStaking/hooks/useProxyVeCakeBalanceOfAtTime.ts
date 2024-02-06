import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { useContractRead } from 'wagmi'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalanceOfAtTime = (timestamp: number) => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCakeUserInfo()

  const hasProxy = useMemo(() => {
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress)
  }, [userInfo])

  const { status, refetch, data } = useContractRead({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOfAtTime',
    abi: veCakeABI,
    args: [userInfo?.cakePoolProxy as Address, BigInt(timestamp)],
    watch: true,
    enabled: Boolean(hasProxy && timestamp),
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
