import { useQuery } from '@tanstack/react-query'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { Address } from 'viem'

export const useUserBoosterStatus = (account?: Address) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { data: MAX_BOOST_POOL, status: maxBoostStatus } = useQuery({
    queryKey: ['maxBoostFarm'],
    queryFn: () => farmBoosterContract.read.MAX_BOOST_POOL(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  const {
    data: activatedPools,
    status,
    refetch,
  } = useQuery({
    queryKey: ['activatedBoostFarm', [account]],
    queryFn: () => farmBoosterContract.read.activedPools([account!]),
    enabled: Boolean(account),
  })

  return {
    maxBoostCounts: MAX_BOOST_POOL ? Number(MAX_BOOST_POOL) : 0,
    activatedPoolsCounts: activatedPools?.length ?? 0,
    remainingCounts: (MAX_BOOST_POOL ? Number(MAX_BOOST_POOL) : 0) - (activatedPools?.length ?? 0),
    isLoading: maxBoostStatus !== 'success' || status !== 'success',
    refreshActivePools: refetch,
  }
}
