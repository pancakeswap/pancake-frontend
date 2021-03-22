import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon, LaurelLeftIcon, LaurelRightIcon } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import ProfileAvatar from '../../../Profile/components/ProfileAvatar'
import Sticker from '../Sticker'

interface ScoreHeaderProps {
  profile: Profile
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LaurelWrapper = styled.div<{ dir?: 'l' | 'r' }>`
  transform: ${({ dir }) => (dir === 'l' ? 'rotate(30deg)' : 'rotate(-30deg)')};
  svg {
    fill: #27262c;
    height: 32px;
    width: auto;
    ${({ theme }) => theme.mediaQueries.sm} {
      height: 45px;
    }
  }
`

const ProfileWrapper = styled.div`
  z-index: 2;
  svg {
    height: 64px;
    width: 64px;

    ${({ theme }) => theme.mediaQueries.sm} {
      height: 128px;
      width: 128px;
    }
  }
`

const ScoreHeader: React.FC<ScoreHeaderProps> = ({ profile }) => {
  return (
    <Wrapper>
      <LaurelWrapper dir="l">
        <LaurelLeftIcon />
      </LaurelWrapper>
      <ProfileWrapper>
        <Sticker>{profile ? <ProfileAvatar profile={profile} /> : <NoProfileAvatarIcon />}</Sticker>
      </ProfileWrapper>
      <LaurelWrapper dir="r">
        <LaurelRightIcon />
      </LaurelWrapper>
    </Wrapper>
  )
}

export default ScoreHeader
