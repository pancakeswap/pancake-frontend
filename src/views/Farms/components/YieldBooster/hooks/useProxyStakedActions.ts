import { useWeb3React } from '@web3-react/core'
import { useBCakeProxyContract } from 'hooks/useContract'

import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'

export default function useProxyStakedActions(pid, lpContract) {
  const { account } = useWeb3React()
  const { proxyAddress } = useBCakeProxyContractAddress(account)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress })),
    [account, proxyAddress, pid, dispatch],
  )

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  return {
    onStake: (value) => stakeFarm(bCakeProxy, pid, value),
    onUnstake: (value) => unstakeFarm(bCakeProxy, pid, value),
    onReward: () => harvestFarm(bCakeProxy, pid),
    onApprove,
    onDone,
  }
}
