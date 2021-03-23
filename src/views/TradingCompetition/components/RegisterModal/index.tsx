import React from 'react'
import styled from 'styled-components'
import { Modal, Button, NoProfileAvatarIcon, Flex } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import useI18n from 'hooks/useI18n'
import { CompetitionProps } from '../../types'
import MakeProfile from './MakeProfile'
import ReactivateProfile from './ReactivateProfile'
import RegisterWithProfile from './RegisterWithProfile'
import ProfileAvatar from '../../../Profile/components/ProfileAvatar'

interface RegisterModalProps extends CompetitionProps {
  onDismiss?: () => void
}

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;
  margin-bottom: 8px;
`

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const RegisterModal: React.FC<RegisterModalProps> = ({ onDismiss, profile }) => {
  const TranslateString = useI18n()

  const modalInner = () => {
    // No profile created
    if (!profile) {
      return <MakeProfile onDismiss={onDismiss} />
    }

    // Profile created and active
    if (profile && profile.isActive) {
      return <RegisterWithProfile profile={profile} />
    }

    // Profile created but not active
    return <ReactivateProfile onDismiss={onDismiss} />
  }

  return (
    <Modal title="Register" onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" maxWidth="400px">
        <AvatarWrapper>{profile ? <ProfileAvatar profile={profile} /> : <StyledNoProfileAvatarIcon />}</AvatarWrapper>
        {modalInner()}
      </Flex>
      <Button variant="text" onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Modal>
  )
}

export default RegisterModal
