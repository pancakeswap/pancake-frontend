import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useIsUserLockedPool } from 'state/pools/hooks'
import { useFarmUser } from 'state/farms/hooks'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { useSWRMulticall } from 'hooks/useSWRContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import { useUserBoosterStatus } from 'views/Farms/hooks/useUserBoosterStatus'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'

export enum YieldBoosterState {
  UNCONNECTED,
  NO_LOCKED,
  NO_PROXY_CREATED,
  NO_MIGRATE,
  NO_LP,
  DEACTIVE,
  ACTIVE,
  MAX,
}

function useIsPoolActive(proxyPid: number): boolean {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { account } = useActiveWeb3React()

  const { data } = useSWRMulticall(
    farmBoosterAbi,
    [{ address: farmBoosterContract.address, name: 'isBoostedPool', params: [account, proxyPid] }],
    { isPaused: () => !account },
  )

  return Array.isArray(data) ? data[0] : false
}

interface UseYieldBoosterStateArgs {
  farmPid: number
  proxyPid: number
}

export default function useYieldBoosterState(yieldBoosterStateArgs: UseYieldBoosterStateArgs): YieldBoosterState {
  const { farmPid, proxyPid } = yieldBoosterStateArgs
  const { account } = useActiveWeb3React()
  const { remainingCounts } = useUserBoosterStatus(account)
  const isLocked = useIsUserLockedPool()
  const { stakedBalance } = useFarmUser(farmPid)
  const { stakedBalance: proxyStakedBalance } = useFarmUser(proxyPid)
  const isActivePool = useIsPoolActive(proxyPid)
  const { proxyCreated } = useBCakeProxyContractAddress(account)

  if (!account || isUndefinedOrNull(isLocked)) {
    return YieldBoosterState.UNCONNECTED
  }

  // depend on usePoolsPageFetch in BCakeBoosterCard to check state
  if (!isLocked) {
    return YieldBoosterState.NO_LOCKED
  }

  // What indicate user created FarmBooster.proxyContract
  if (!proxyCreated) {
    return YieldBoosterState.NO_PROXY_CREATED
  }

  if (stakedBalance.gt(0)) {
    return YieldBoosterState.NO_MIGRATE
  }

  // If user no balance after migration
  if (proxyStakedBalance.isLessThanOrEqualTo(0)) {
    return YieldBoosterState.NO_LP
  }

  if (remainingCounts === 0) {
    return YieldBoosterState.MAX
  }

  if (isActivePool) {
    return YieldBoosterState.DEACTIVE
  }

  return YieldBoosterState.ACTIVE
}
