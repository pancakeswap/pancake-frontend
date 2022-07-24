import { FetchStatus } from 'config/constants/types'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import useSWR from 'swr'

export const useUserBoosterStatus = (account: string) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { data: MAX_BOOST_POOL, status: maxBoostStatus } = useSWR('maxBoostFarm', () =>
    farmBoosterContract.MAX_BOOST_POOL(),
  )
  const {
    data: activatedPools,
    status,
    mutate,
  } = useSWR(['activatedBoostFarm', account], () => farmBoosterContract.activedPools(account))
  return {
    maxBoostCounts: MAX_BOOST_POOL?.toNumber() ?? 0,
    activatedPoolsCounts: activatedPools?.length ?? 0,
    remainingCounts: (MAX_BOOST_POOL?.toNumber() ?? 0) - (activatedPools?.length ?? 0),
    isLoading: maxBoostStatus !== FetchStatus.Fetched || status !== FetchStatus.Fetched,
    refreshActivePools: mutate,
  }
}
