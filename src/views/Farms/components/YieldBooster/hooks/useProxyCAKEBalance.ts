import { useWeb3React } from '@pancakeswap/wagmi'
import { useSWRContract } from 'hooks/useSWRContract'
import { getCakeContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import BigNumber from 'bignumber.js'

const useProxyCAKEBalance = () => {
  const { account } = useWeb3React()
  const { proxyAddress } = useBCakeProxyContractAddress(account)
  const cakeContract = getCakeContract()

  const { data, mutate } = useSWRContract([cakeContract, 'balanceOf', [proxyAddress]])

  return {
    refreshProxyCakeBalance: mutate,
    proxyCakeBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyCAKEBalance
