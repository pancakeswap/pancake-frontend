import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmUser } from 'state/farms/hooks'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { useSWRMulticall } from 'hooks/useSWRContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import { useUserBoosterStatus } from 'views/Farms/hooks/useUserBoosterStatus'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'
import { useCallback } from 'react'

export enum YieldBoosterState {
  UNCONNECTED,
  NO_LOCKED,
  LOCKED_END,
  NO_PROXY_CREATED,
  NO_MIGRATE,
  NO_LP,
  DEACTIVE,
  ACTIVE,
  MAX,
}

function useIsPoolActive(proxyPid: number) {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { account } = useActiveWeb3React()

  const { data, mutate } = useSWRMulticall(
    farmBoosterAbi,
    [{ address: farmBoosterContract.address, name: 'isBoostedPool', params: [account, proxyPid] }],
    { isPaused: () => !account },
  )

  return {
    isActivePool: Array.isArray(data) ? data[0][0] : false,
    refreshIsPoolActive: mutate,
  }
}

interface UseYieldBoosterStateArgs {
  farmPid: number
  proxyPid: number
}

export default function useYieldBoosterState(yieldBoosterStateArgs: UseYieldBoosterStateArgs) {
  const { farmPid, proxyPid } = yieldBoosterStateArgs
  const { account } = useActiveWeb3React()
  const { remainingCounts, refreshActivePools } = useUserBoosterStatus(account)
  // REFACTOR: This is re-render overhead
  const { locked, lockedEnd } = useUserLockedCakeStatus()
  const { stakedBalance } = useFarmUser(farmPid)
  const { stakedBalance: proxyStakedBalance } = useFarmUser(proxyPid)
  const { isActivePool, refreshIsPoolActive } = useIsPoolActive(proxyPid)
  const { proxyCreated } = useBCakeProxyContractAddress(account)

  const refreshActivePool = useCallback(() => {
    refreshActivePools()
    refreshIsPoolActive()
  }, [refreshActivePools, refreshIsPoolActive])

  let state = null

  if (!account || isUndefinedOrNull(locked)) {
    state = YieldBoosterState.UNCONNECTED
  } else if (!locked) {
    // depend on usePoolsPageFetch in BCakeBoosterCard to check state
    // duplicate logic in BCakeBoosterCard
    state = YieldBoosterState.NO_LOCKED
  } else if (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000)) {
    state = YieldBoosterState.LOCKED_END
  } else if (!proxyCreated) {
    state = YieldBoosterState.NO_PROXY_CREATED
  } else if (stakedBalance.gt(0)) {
    state = YieldBoosterState.NO_MIGRATE
  } else if (proxyStakedBalance.isLessThanOrEqualTo(0)) {
    state = YieldBoosterState.NO_LP
  } else if (remainingCounts === 0) {
    state = YieldBoosterState.MAX
  } else if (isActivePool) {
    state = YieldBoosterState.ACTIVE
  } else {
    state = YieldBoosterState.DEACTIVE
  }

  return {
    state,
    refreshActivePool,
  }
}
