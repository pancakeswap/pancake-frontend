import { useWeb3React } from '@pancakeswap/wagmi'
import { useBCakeProxyContract } from 'hooks/useContract'

import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyCAKEBalance from './useProxyCAKEBalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account } = useWeb3React()
  const { proxyAddress } = useBCakeProxyContractAddress(account)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const dispatch = useAppDispatch()
  const { proxyCakeBalance, refreshProxyCakeBalance } = useProxyCAKEBalance()

  const onDone = useCallback(() => {
    refreshProxyCakeBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress }))
  }, [account, proxyAddress, pid, dispatch, refreshProxyCakeBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback((value) => stakeFarm(bCakeProxy, pid, value), [bCakeProxy, pid])

  const onUnstake = useCallback((value) => unstakeFarm(bCakeProxy, pid, value), [bCakeProxy, pid])

  const onReward = useCallback(() => harvestFarm(bCakeProxy, pid), [bCakeProxy, pid])

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyCakeBalance,
  }
}
