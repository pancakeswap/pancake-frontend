import { ChainId } from '@pancakeswap/chains'
import { ICAKE, iCakeABI } from '@pancakeswap/ifos'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { Address, useContractRead } from 'wagmi'

interface UseVeCakeUserCreditWithTime {
  userCreditWithTime: number
  refresh: () => void
}

export const useVeCakeUserCreditWithTime = (endTime: number): UseVeCakeUserCreditWithTime => {
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useContractRead({
    chainId,
    address: chainId && ICAKE[chainId] ? ICAKE[chainId] : ICAKE[ChainId.BSC],
    functionName: 'getUserCreditWithTime',
    abi: iCakeABI,
    args: [account as Address, BigInt(endTime)],
    watch: true,
    enabled: Boolean(account && chainId && endTime),
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
