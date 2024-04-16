import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalanceOfAtTime = (timestamp: number) => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCakeUserInfo()

  const hasProxy = useMemo(() => {
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress)
  }, [userInfo])

  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { status, refetch, data } = useReadContract({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOfAtTime',
    abi: veCakeABI,
    args: [userInfo?.cakePoolProxy as Address, BigInt(timestamp)],
    query: {
      enabled: Boolean(hasProxy && timestamp),
    },
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, refetch])

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
