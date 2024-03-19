import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { getCakeContract } from 'utils/contractHelpers'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { useReadContract } from 'wagmi'

const useProxyCAKEBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const cakeContract = getCakeContract()

  const { data, refetch } = useReadContract({
    chainId,
    ...cakeContract,
    enabled: Boolean(account && proxyAddress),
    functionName: 'balanceOf',
    args: [proxyAddress],
  })

  return {
    refreshProxyCakeBalance: refetch,
    proxyCakeBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyCAKEBalance
