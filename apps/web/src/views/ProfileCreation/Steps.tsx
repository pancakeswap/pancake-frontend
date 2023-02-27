import { useContext } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useAccount } from 'wagmi'
import NoWalletConnected from './WalletNotConnected'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import Mint from './Mint'
import ProfilePicture from './ProfilePicture'
import TeamSelection from './TeamSelection'
import UserName from './UserName'

const Steps = () => {
  const { t } = useTranslation()
  const { isInitialized, currentStep } = useContext(ProfileCreationContext)
  const { address: account } = useAccount()

  if (!account) {
    return <NoWalletConnected />
  }

  if (!isInitialized) {
    return <div>{t('Loading...')}</div>
  }

  if (currentStep === 0) {
    return <Mint />
  }

  if (currentStep === 1) {
    return <ProfilePicture />
  }

  if (currentStep === 2) {
    return <TeamSelection />
  }

  if (currentStep === 3) {
    return <UserName />
  }

  return null
}

export default Steps
