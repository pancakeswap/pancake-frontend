import useSWR from 'swr'
import { CAKE } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeProxyContract, useCake } from 'hooks/useContract'
import { useBCakeProxyContractAddress } from './useBCakeProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBCakeProxyBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const { reader: cakeContract } = useCake()

  const { data, status } = useSWR(
    account && bCakeProxy && !isProxyContractAddressLoading && ['bCakeProxyBalance', account],
    async () => {
      const rawBalance = await cakeContract.balanceOf(bCakeProxy.address)
      return new BigNumber(rawBalance.toString())
    },
  )

  const balanceAmount = useMemo(() => getBalanceAmount(data, CAKE[chainId].decimals), [data, chainId])

  return useMemo(() => {
    return {
      bCakeProxyBalance: data ? balanceAmount.toNumber() : 0,
      bCakeProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD)
          ? getFullDisplayBalance(data, CAKE[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBCakeProxyBalance
