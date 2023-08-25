import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useIsBoostedPool, useBakeV3farmCanBoost } from './useBCakeV3Info'

export enum BoostStatus {
  UpTo,
  farmCanBoostButNot,
  Boosted,
  CanNotBoost,
}

export const useBoostStatus = (pid: number, tokenId?: string) => {
  const { address: account } = useAccount()
  const { isBoosted, mutate } = useIsBoostedPool(tokenId)
  const { farmCanBoost } = useBakeV3farmCanBoost(pid)
  const status = useMemo(() => {
    if (!account && !farmCanBoost) return BoostStatus.CanNotBoost
    if (!account && farmCanBoost) return BoostStatus.UpTo
    if (farmCanBoost) return isBoosted ? BoostStatus.Boosted : BoostStatus.farmCanBoostButNot
    return BoostStatus.CanNotBoost
  }, [account, farmCanBoost, isBoosted])

  return { status, updateStatus: mutate }
}
