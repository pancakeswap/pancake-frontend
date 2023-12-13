import { getCrossFarmingSenderContract } from 'utils/contractHelpers'
import { useMemo } from 'react'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useQuery } from '@tanstack/react-query'

export const useFirstTimeCrossFarming = (vaultPid: number | undefined) => {
  const { account, chainId } = useAccountActiveChain()
  const crossFarmingAddress = useMemo(() => {
    return vaultPid && chainId ? getCrossFarmingSenderContract(null, chainId) : null
  }, [chainId, vaultPid])

  const { data, refetch } = useQuery(
    ['isFirstTimeCrossFarming', account, chainId],
    async () => {
      const firstTimeDeposit = await crossFarmingAddress.read.is1st([account])
      return !firstTimeDeposit
    },
    {
      enabled: Boolean(account && crossFarmingAddress),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return { isFirstTime: data, refresh: refetch }
}
