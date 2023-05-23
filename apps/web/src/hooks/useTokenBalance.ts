import { ChainId } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'

import { Address, erc20ABI, useAccount, useBalance, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address, forceBSC?: boolean) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useContractRead({
    chainId: forceBSC ? ChainId.BSC : chainId,
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account],
    enabled: !!account,
    watch: true,
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO,
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()
  const { status, refetch, data } = useBalance({
    chainId: ChainId.BSC,
    address: account,
    watch: true,
    enabled: !!account,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useBSCCakeBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(CAKE[ChainId.BSC]?.address, true)

  return { balance: BigInt(balance.toString()), fetchStatus }
}

export default useTokenBalance
