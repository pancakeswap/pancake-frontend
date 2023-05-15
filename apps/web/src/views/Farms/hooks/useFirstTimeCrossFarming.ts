import useSWRImmutable from 'swr/immutable'
import { getCrossFarmingSenderContract } from 'utils/contractHelpers'
import { useMemo } from 'react'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

export const useFirstTimeCrossFarming = (vaultPid: number | undefined) => {
  const { account, chainId } = useAccountActiveChain()
  const crossFarmingAddress = useMemo(() => {
    return vaultPid && chainId ? getCrossFarmingSenderContract(null, chainId) : null
  }, [chainId, vaultPid])

  const { data, mutate } = useSWRImmutable(
    account && crossFarmingAddress && ['isFirstTimeCrossFarming', account, chainId],
    async () => {
      const firstTimeDeposit = await crossFarmingAddress.read.is1st([account])
      return !firstTimeDeposit
    },
  )

  return { isFirstTime: data, refresh: mutate }
}
