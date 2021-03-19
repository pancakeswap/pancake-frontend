import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import ProfileAvatar from '../../../Profile/components/ProfileAvatar'
import Sticker from '../Sticker'
import StyledLaurel from '../StyledLaurel'

interface ScoreHeaderProps {
  profile: Profile
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LaurelWrapper = styled.div`
  svg {
    height: 32px;
    width: auto;
    ${({ theme }) => theme.mediaQueries.sm} {
      height: 64px;
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
      <LaurelWrapper>
        <StyledLaurel dir="l" />
      </LaurelWrapper>
      <ProfileWrapper>
        <Sticker>{profile ? <ProfileAvatar profile={profile} /> : <NoProfileAvatarIcon />}</Sticker>
      </ProfileWrapper>
      <LaurelWrapper>
        <StyledLaurel dir="r" />
      </LaurelWrapper>
    </Wrapper>
  )
}

export default ScoreHeader
