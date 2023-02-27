import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSWRContract } from 'hooks/useSWRContract'
import { getCakeContract } from 'utils/contractHelpers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import BigNumber from 'bignumber.js'

const useProxyCAKEBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const cakeContract = getCakeContract()

  const { data, mutate } = useSWRContract([cakeContract, 'balanceOf', [proxyAddress]])

  return {
    refreshProxyCakeBalance: mutate,
    proxyCakeBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyCAKEBalance
