import React from 'react'
import styled from 'styled-components'
import { Modal, Button, LinkExternal, Flex } from '@pancakeswap-libs/uikit'
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

const ProfileWrapper = styled.div``

const RegisterModal: React.FC<RegisterModalProps> = ({ onDismiss, profile }) => {
  const TranslateString = useI18n()

  return (
    <Modal title="Register" onDismiss={onDismiss}>
      <ProfileWrapper>
        <ProfileAvatar profile={profile} />
      </ProfileWrapper>
      {!profile && <MakeProfile />}
      {profile && profile.isActive ? <RegisterWithProfile /> : <ReactivateProfile />}
      <Button variant="text" onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Modal>
  )
}

export default RegisterModal
