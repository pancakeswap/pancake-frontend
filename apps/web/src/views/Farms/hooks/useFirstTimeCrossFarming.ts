import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { getCrossFarmingSenderContract } from 'utils/contractHelpers'

export const useFirstTimeCrossFarming = (vaultPid: number | undefined) => {
  const { account, chainId } = useAccountActiveChain()
  const crossFarmingAddress = useMemo(() => {
    return vaultPid && chainId ? getCrossFarmingSenderContract(undefined, chainId) : null
  }, [chainId, vaultPid])

  const { data, refetch } = useQuery({
    queryKey: ['isFirstTimeCrossFarming', account, chainId],

    queryFn: async () => {
      const firstTimeDeposit = await crossFarmingAddress?.read.is1st([account!])
      return !firstTimeDeposit
    },

    enabled: Boolean(account && crossFarmingAddress),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return { isFirstTime: data, refresh: refetch }
}
