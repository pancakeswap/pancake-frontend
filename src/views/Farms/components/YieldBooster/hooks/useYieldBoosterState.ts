import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useIsUserLockedPool } from 'state/pools/hooks'
import { useFarmUser } from 'state/farms/hooks'
import { useFarmBooster } from 'hooks/useContract'
import { useSWRMulticall } from 'hooks/useSWRContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'

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

// use swr to refetch the it
function useHasReachedMaxPool() {
  const farmBoosterContract = useFarmBooster()
  const { account } = useActiveWeb3React()

  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'MAX_BOOST_POOL',
    },
    {
      address: farmBoosterContract.address,
      name: 'activedPools',
      params: [account],
    },
  ]

  const { data } = useSWRMulticall(farmBoosterAbi, calls, {
    isPaused: () => !account,
  })

  if (!data) {
    return 0
  }

  // TODO: add type
  const [[MAX_BOOST_POOL], [, pools]] = data

  const maxBoosPool = MAX_BOOST_POOL?.toNumber() || 0
  const hasReachedMaxPool = maxBoosPool && pools?.length === maxBoosPool

  return hasReachedMaxPool
}

function useIsPoolActive(proxyPid) {
  const farmBoosterContract = useFarmBooster()
  const { account } = useActiveWeb3React()

  const { data } = useSWRMulticall(
    farmBoosterAbi,
    [{ address: farmBoosterContract.address, name: 'isBoostedPool', params: [account, proxyPid] }],
    { isPaused: () => !account },
  )

  return Array.isArray(data) ? data[0] : false
}

export default function useYieldBoosterState({ farmPid, proxyPid }) {
  const { account } = useActiveWeb3React()
  const isLocked = useIsUserLockedPool()
  const { stakedBalance } = useFarmUser(farmPid)
  const hasReachedMaxPool = useHasReachedMaxPool()
  const { stakedBalance: proxyStakedBalance, allowance } = useFarmUser(proxyPid)
  const isActivePool = useIsPoolActive(proxyPid)

  if (!account || isUndefinedOrNull(isLocked)) {
    return YieldBoosterState.UNCONNECTED
  }

  // fetch VaultWithUserData in the Farms component to verify locked state
  if (!isLocked) {
    return YieldBoosterState.NO_LOCKED
  }

  // What indicate user created FarmBooster.proxyContract
  if (!allowance.gt(0)) {
    return YieldBoosterState.NO_PROXY_CREATED
  }

  if (stakedBalance.gt(0)) {
    return YieldBoosterState.NO_MIGRATE
  }

  // If user no balance after migration
  if (proxyStakedBalance.isLessThanOrEqualTo(0)) {
    return YieldBoosterState.NO_LP
  }

  if (hasReachedMaxPool) {
    return YieldBoosterState.MAX
  }

  if (isActivePool) {
    return YieldBoosterState.DEACTIVE
  }

  return YieldBoosterState.ACTIVE
}
