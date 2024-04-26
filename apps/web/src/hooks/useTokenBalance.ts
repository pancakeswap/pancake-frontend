import { ChainId } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { Address, erc20Abi } from 'viem'
import { useAccount, useBalance, useBlockNumber, useReadContract } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address, forceBSC?: boolean) => {
  return useTokenBalanceByChain(tokenAddress, forceBSC ? ChainId.BSC : undefined)
}

export const useTokenBalanceByChain = (tokenAddress: Address, chainIdOverride?: ChainId) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { data, status, refetch, ...rest } = useReadContract({
    chainId: chainIdOverride || chainId,
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account || '0x'],
    query: {
      enabled: !!account,
    },
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, refetch])

  return {
    ...rest,
    refetch,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { status, refetch, data } = useBalance({
    chainId: ChainId.BSC,
    address: account,
    query: {
      enabled: !!account,
    },
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, refetch])

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useGetNativeTokenBalance = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { status, refetch, data } = useBalance({
    chainId,
    address: account,
    query: {
      enabled: !!account,
    },
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, refetch])

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useBSCCakeBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(CAKE[ChainId.BSC]?.address, true)

  return { balance: BigInt(balance.toString()), fetchStatus }
}

// veCake only deploy on bsc/bscTestnet
export const useVeCakeBalance = () => {
  const { chainId } = useActiveChainId()
  const { balance, fetchStatus } = useTokenBalance(getVeCakeAddress(chainId))

  return { balance, fetchStatus }
}

export default useTokenBalance
