import useSWRImmutable from 'swr/immutable'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getCrossFarmingSenderContract } from 'utils/contractHelpers'
import { useMemo } from 'react'

export const useFirstTimeCrossFarming = (vaultPid: number) => {
  const { account, chainId } = useActiveWeb3React()
  const crossFarmingAddress = useMemo(() => {
    return vaultPid && chainId ? getCrossFarmingSenderContract(null, chainId) : null
  }, [chainId, vaultPid])

  const { data, mutate } = useSWRImmutable(
    account && crossFarmingAddress && ['isFirstTimeCrossFarming', account, chainId],
    async () => {
      const firstTimeDeposit = await crossFarmingAddress.is1st(account)
      return !firstTimeDeposit
    },
  )

  return { isFirstTime: data, refresh: mutate }
}
