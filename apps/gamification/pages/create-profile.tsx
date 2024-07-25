import { ChainId } from '@pancakeswap/chains'
import ProfileCreation from 'views/ProfileCreation'

const ProfileCreationPage = () => {
  return <ProfileCreation />
}

ProfileCreationPage.chains = [ChainId.BSC]
export default ProfileCreationPage
