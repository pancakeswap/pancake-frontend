import React from 'react'
import styled from 'styled-components'
import { useModal } from '@pancakeswap-libs/uikit'
import EditProfileModal from './EditProfileModal'
import ProfileAvatar, { ProfileAvatarProps } from './ProfileAvatar'

const EditOverlay = styled.div`
  background: rgba(0, 0, 0, 0.6) url('/images/camera.svg') no-repeat center center;
  background-size: 24px;
  border-radius: 50%;
  left: 0;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity 300ms;
  width: 100%;
  z-index: 3;

  ${({ theme }) => theme.mediaQueries.sm} {
    background-size: 48px;
  }
`

const StyledEditProfileAvatar = styled.div`
  position: relative;

  &:hover {
    cursor: pointer;

    ${EditOverlay} {
      opacity: 1;
    }
  }
`

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const EditProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)

  return (
    <StyledEditProfileAvatar onClick={onEditProfileModal}>
      <AvatarWrapper>
        <ProfileAvatar profile={profile} />
      </AvatarWrapper>
      <EditOverlay />
    </StyledEditProfileAvatar>
  )
}

export default EditProfileAvatar
