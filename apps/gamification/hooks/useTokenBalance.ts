import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useBalance, useReadContract } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address, forceBSC?: boolean) => {
  return useTokenBalanceByChain(tokenAddress, forceBSC ? ChainId.BSC : undefined)
}

export const useTokenBalanceByChain = (tokenAddress: Address, chainIdOverride?: ChainId) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, refetch, ...rest } = useReadContract({
    chainId: chainIdOverride || chainId,
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account || '0x'],
    query: {
      enabled: Boolean(!!account && tokenAddress),
    },
    watch: true,
  })

  return {
    ...rest,
    refetch,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()

  const { status, refetch, data } = useBalance({
    chainId: ChainId.BSC,
    address: account,
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useGetNativeTokenBalance = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useBalance({
    chainId,
    address: account,
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useBSCCakeBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(CAKE[ChainId.BSC]?.address, true)

  return { balance: BigInt(balance.toString()), fetchStatus }
}

export const useCurrencyBalance = (currency: Currency | null | undefined) => {
  const native = useNativeCurrency()
  const isNativeToken = currency?.symbol === native?.symbol && currency.chainId === native.chainId

  const { balance: tokenBalance } = useTokenBalanceByChain(
    currency.isNativeToken ? currency?.wrapped?.address : currency?.address,
  )
  const { balance: nativeTokenBalance } = useGetNativeTokenBalance()

  if (!currency) {
    return BIG_ZERO
  }

  return isNativeToken ? new BigNumber(nativeTokenBalance.toString()) : tokenBalance
}

export default useTokenBalance
