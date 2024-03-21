import { getAptRewardFarmConfig } from 'config/constants/aptRewardFarm'
import { useActiveChainId } from 'hooks/useNetwork'
import { useMemo } from 'react'

export const useIsAptRewardFarm = (lpAddress?: string) => {
  const chainId = useActiveChainId()

  return useMemo(
    () =>
      lpAddress
        ? chainId && getAptRewardFarmConfig(chainId)?.find((f) => f.lpAddress.toLowerCase() === lpAddress.toLowerCase())
        : false,
    [chainId, lpAddress],
  )
}
