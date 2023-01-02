import useSWR from 'swr'
import { CAKE } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeProxyContract, useCake } from 'hooks/useContract'
import { useBCakeProxyContractAddress } from './useBCakeProxyContractAddress'

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

  return useMemo(() => {
    return {
      bCakeProxyBalance: data ? getBalanceNumber(data) : 0,
      bCakeProxyDisplayBalance: data ? getFullDisplayBalance(data, CAKE[chainId].decimals, 3) : null,
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, status, chainId])
}

export default useBCakeProxyBalance
