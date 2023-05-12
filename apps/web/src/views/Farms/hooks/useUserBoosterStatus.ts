import { FetchStatus } from 'config/constants/types'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { Address } from 'wagmi'

export const useUserBoosterStatus = (account: Address) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { data: MAX_BOOST_POOL, status: maxBoostStatus } = useSWRImmutable('maxBoostFarm', () =>
    farmBoosterContract.read.MAX_BOOST_POOL(),
  )
  const {
    data: activatedPools,
    status,
    mutate,
  } = useSWR(account && ['activatedBoostFarm', [account]], () => farmBoosterContract.read.activedPools([account]))

  return {
    maxBoostCounts: MAX_BOOST_POOL ? Number(MAX_BOOST_POOL) : 0,
    activatedPoolsCounts: activatedPools?.length ?? 0,
    remainingCounts: (MAX_BOOST_POOL ? Number(MAX_BOOST_POOL) : 0) - (activatedPools?.length ?? 0),
    isLoading: maxBoostStatus !== FetchStatus.Fetched || status !== FetchStatus.Fetched,
    refreshActivePools: mutate,
  }
}
