import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useIsValidDashboardUser = () => {
  const { address: account } = useAccount()

  return useMemo(() => Boolean(account && true), [account])
}
