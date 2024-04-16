import { ChainId } from '@pancakeswap/chains'
import { ICAKE, iCakeABI } from '@pancakeswap/ifos'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'

interface UseVeCakeUserCreditWithTime {
  userCreditWithTime: number
  refresh: () => void
}

export const useVeCakeUserCreditWithTime = (endTime: number): UseVeCakeUserCreditWithTime => {
  const { account, chainId } = useAccountActiveChain()
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { data, refetch, queryKey } = useReadContract({
    chainId,
    address: chainId && ICAKE[chainId] ? ICAKE[chainId] : ICAKE[ChainId.BSC],
    functionName: 'getUserCreditWithTime',
    abi: iCakeABI,
    args: [account as Address, BigInt(endTime)],
    query: {
      enabled: Boolean(account && chainId && endTime),
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient])

  const userCreditWithTime = useMemo(
    () => (typeof data !== 'undefined' ? new BigNumber(data.toString()).toNumber() : 0),
    [data],
  )

  return {
    userCreditWithTime,
    refresh: refetch,
  }
}
