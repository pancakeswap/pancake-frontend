import { useMemo } from 'react'
import { useAccount } from 'wagmi'

const WHITE_LIST_WALLET_ADDRESS = [
  '0x7544503807b4DF4fc3Db6AcF4f32Ce5E7eE8FdFb', // Chef Momota
].map((i) => i.toLowerCase())

export const useIsValidDashboardUser = (): boolean => {
  const { address: account } = useAccount()

  return useMemo(() => Boolean(account) && WHITE_LIST_WALLET_ADDRESS.includes(account?.toLowerCase() ?? ''), [account])
}
