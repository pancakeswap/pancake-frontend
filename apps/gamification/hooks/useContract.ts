import { useWalletClient } from 'wagmi'

import { useMemo } from 'react'
import { getBunnyFactoryContract, getProfileContract } from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */
export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer ?? undefined), [signer])
}

export const useProfileContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer ?? undefined), [signer])
}
