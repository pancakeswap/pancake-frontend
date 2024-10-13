import { CAKE } from '@pancakeswap/tokens'
import { getBalanceAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCakeProxyContract, useCake } from 'hooks/useContract'
import { useMemo } from 'react'
import { useBCakeProxyContractAddress } from '../../../hooks/useBCakeProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBCakeProxyBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const cakeContract = useCake()

  const { data, status } = useQuery({
    queryKey: ['bCakeProxyBalance', account],

    queryFn: async () => {
      const rawBalance = await cakeContract?.read.balanceOf([bCakeProxy!.address])
      return rawBalance ? new BigNumber(rawBalance.toString()) : new BigNumber(0)
    },

    enabled: Boolean(account && bCakeProxy && !isProxyContractAddressLoading),
  })

  const balanceAmount = useMemo(
    () => (data && chainId ? getBalanceAmount(data, CAKE[chainId].decimals) : new BigNumber(NaN)),
    [data, chainId],
  )

  return useMemo(() => {
    return {
      bCakeProxyBalance: data ? balanceAmount.toNumber() : 0,
      bCakeProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD) && chainId
          ? getFullDisplayBalance(data, CAKE[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== 'success',
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBCakeProxyBalance
