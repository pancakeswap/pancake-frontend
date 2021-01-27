import React, { useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import Mint from './Mint'
import ProfilePicture from './ProfilePicture'
import TeamSelection from './TeamSelection'

const Steps = () => {
  const { isInitialized, currentStep } = useContext(ProfileCreationContext)
  const { account } = useWallet()
  const TranslateString = useI18n()

  if (!account) {
    return (
      <div>
        <Heading size="xl" mb="8px">
          {TranslateString(999, 'Oops!')}
        </Heading>
        <Text as="p" mb="16px">
          {TranslateString(999, 'Please connect your wallet to continue')}
        </Text>
        <UnlockButton />
      </div>
    )
  }

  if (!isInitialized) {
    return <div>Loading...</div>
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

  return null
}

export default Steps
