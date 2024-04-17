import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { Address, erc20Abi, isAddressEqual, zeroAddress } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useProxyVeCakeBalance = () => {
  const { chainId } = useActiveChainId()
  const queryClient = useQueryClient()
  const { data: userInfo } = useVeCakeUserInfo()

  const hasProxy = useMemo(() => {
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress)
  }, [userInfo])
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { status, refetch, data, queryKey } = useReadContract({
    chainId,
    address: getVeCakeAddress(chainId),
    functionName: 'balanceOf',
    abi: erc20Abi,
    args: [userInfo?.cakePoolProxy as Address],
    query: {
      enabled: hasProxy,
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient])

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
