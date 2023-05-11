import { Zero } from '@ethersproject/constants'
import { ChainId } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { BigNumber as EthersBigNumber } from 'ethers'
import useSWR from 'swr'
import { bscRpcProvider } from 'utils/providers'
import { Address, erc20ABI, useAccount, useContractRead } from 'wagmi'
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
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO,
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()
  const { status, data, mutate } = useSWR([account, 'bnbBalance'], async () => {
    return bscRpcProvider.getBalance(account)
  })

  return { balance: data || Zero, fetchStatus: status, refresh: mutate }
}

export const useGetCakeBalance = () => {
  const { chainId } = useWeb3React()
  const { balance, fetchStatus } = useTokenBalance(CAKE[chainId]?.address || CAKE[ChainId.BSC]?.address, true)

  // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
  return { balance: EthersBigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance
