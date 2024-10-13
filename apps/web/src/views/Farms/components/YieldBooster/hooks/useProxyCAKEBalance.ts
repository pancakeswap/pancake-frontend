import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { getCakeContract } from 'utils/contractHelpers'
import { useBCakeProxyContractAddress } from 'hooks/useBCakeProxyContractAddress'
import { useReadContract } from '@pancakeswap/wagmi'
import { useCallback } from 'react'

const useProxyCAKEBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const cakeContract = getCakeContract()

  const { data = 0, refetch } = useReadContract({
    chainId,
    address: cakeContract.address,
    abi: cakeContract.abi,
    query: {
      enabled: Boolean(account && proxyAddress),
      select: useCallback(
        (cakeBalance: bigint) => (cakeBalance ? getBalanceNumber(new BigNumber(cakeBalance.toString())) : 0),
        [],
      ),
    },
    functionName: 'balanceOf',
    args: proxyAddress && [proxyAddress],
  })

  return {
    refreshProxyCakeBalance: refetch,
    proxyCakeBalance: data,
  }
}

export default useProxyCAKEBalance
