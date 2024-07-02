import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useAccount } from 'wagmi'

const WHITE_LIST_WALLET_ADDRESS = [
  '0x7544503807b4DF4fc3Db6AcF4f32Ce5E7eE8FdFb', // Chef Momota
  '0xCd4b47cc780529B4529C5Ed50f31fa8f30bF34aa', // Chef Oreo
  '0xa9c60777fD1A95602D6c080A72Ff02324373F609', // Chef Ruby
  '0xA13bb13609c3B9AABB8A4D5B4E9EcbaF502cA56E', // Chef Ruby
  '0xC9E86aB663c713B3Fb874c073176670acb967ad7', // Chef Fran
  '0x621B94f09fdD36BDe89eDca8193bbB7865bb950d', // Chef Brownie
  '0x586ca92c4AB530f9F9b686aD754e1274702C037f', // Chef Brie
  '0x273B863F7234804DEE624726A69EC228eb01E3d2', // Chef Cannoli
  '0xee867c4d0D4A530D7551B57Ef097d1D7ceDA5879', // Chef Honey
].map((i) => i.toLowerCase())

export const useIsValidDashboardUser = () => {
  const { address: account } = useAccount()

  const { data, status } = useQuery({
    queryKey: ['validDashboardUser', account],
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
