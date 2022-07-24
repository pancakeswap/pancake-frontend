import { usePoolsWithVault, useVaultPoolByKey, usePoolsPageFetch } from 'state/pools/hooks'
import { useMemo } from 'react'
import { DeserializedLockedCakeVault } from 'state/types'

export const useUserLockedCakeStatus = () => {
  usePoolsPageFetch()
  const { pools } = usePoolsWithVault()
  const cakePool = useMemo(() => pools.find((pool) => pool.userData && pool.sousId === 0), [pools])
  const vaultPool = useVaultPoolByKey(cakePool.vaultKey) as DeserializedLockedCakeVault

  return {
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
  }
}
