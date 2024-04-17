import { ChainId } from '@pancakeswap/chains'
import { ICAKE, iCakeABI } from '@pancakeswap/ifos'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useReadContract } from '@pancakeswap/wagmi'
import { useMemo } from 'react'
import { Address } from 'viem'

interface UseVeCakeUserCreditWithTime {
  userCreditWithTime: number
  refresh: () => void
}

export const useVeCakeUserCreditWithTime = (endTime: number): UseVeCakeUserCreditWithTime => {
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useReadContract({
    chainId,
    address: chainId && ICAKE[chainId] ? ICAKE[chainId] : ICAKE[ChainId.BSC],
    functionName: 'getUserCreditWithTime',
    abi: iCakeABI,
    args: [account as Address, BigInt(endTime)],
    query: {
      enabled: Boolean(account && chainId && endTime),
    },
    watch: true,
  })

  const userCreditWithTime = useMemo(
    () => (typeof data !== 'undefined' ? new BigNumber(data.toString()).toNumber() : 0),
    [data],
  )

  return {
    userCreditWithTime,
    refresh: refetch,
  }
}
