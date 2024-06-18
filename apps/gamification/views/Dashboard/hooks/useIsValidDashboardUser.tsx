import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useAccount } from 'wagmi'

const WHITE_LIST_WALLET_ADDRESS = [
  '0x7544503807b4DF4fc3Db6AcF4f32Ce5E7eE8FdFb', // Chef Momota
].map((i) => i.toLowerCase())

export const useIsValidDashboardUser = () => {
  const { address: account } = useAccount()

  const { data, status } = useQuery({
    queryKey: [account, 'validDashboardUser'],
    queryFn: () => {
      return Boolean(account) && WHITE_LIST_WALLET_ADDRESS.includes(account?.toLowerCase() ?? '')
    },
    refetchOnWindowFocus: false,
  })

  return {
    isValidLoginToDashboard: data,
    isFetched: status === FetchStatus.Fetched,
  }
}
