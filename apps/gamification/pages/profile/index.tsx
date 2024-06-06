import { NftProfileLayout } from 'views/Profile'
import { useAccount } from 'wagmi'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const isConnectedProfile = account?.toLowerCase()

  return <></>
}

ProfilePage.Layout = NftProfileLayout

export default ProfilePage
