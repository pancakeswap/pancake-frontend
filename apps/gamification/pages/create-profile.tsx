import { SUPPORT_ONLY_BSC } from 'config/supportedChain'
import ProfileCreation from 'views/ProfileCreation'

const ProfileCreationPage = () => {
  return <ProfileCreation />
}

ProfileCreationPage.chains = SUPPORT_ONLY_BSC
export default ProfileCreationPage
