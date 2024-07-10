import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useIsValidDashboardUser = (): boolean => {
  const { address: account } = useAccount()

  return useMemo(() => Boolean(account), [account])
}
