import { BOOSTED_FARM_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCakeProxyContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useGasPrice } from 'state/user/hooks'
import { MasterChefContractType, harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { useBCakeProxyContractAddress } from 'hooks/useBCakeProxyContractAddress'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyCAKEBalance from './useProxyCAKEBalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress) as unknown as MasterChefContractType
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyCakeBalance, refreshProxyCakeBalance } = useProxyCAKEBalance()

  const onDone = useCallback(() => {
    if (!account || !chainId) return
    refreshProxyCakeBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyCakeBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback(
    (value) => stakeFarm(bCakeProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCakeProxy, pid, gasPrice],
  )

  const onUnstake = useCallback(
    (value) => unstakeFarm(bCakeProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCakeProxy, pid, gasPrice],
  )

  const onReward = useCallback(
    () => harvestFarm(bCakeProxy, pid, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCakeProxy, pid, gasPrice],
  )

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyCakeBalance,
  }
}
