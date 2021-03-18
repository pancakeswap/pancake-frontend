import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import ProfileAvatar from '../../../Profile/components/ProfileAvatar'
import Sticker from '../Sticker'
import Laurel from '../Laurel'

interface ScoreHeadingProps {
  profile: Profile
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LaurelWrapper = styled.div`
  height: 32px;
  width: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
  }
`

const ProfileWrapper = styled.div`
  svg {
    height: 64px;
    width: 64px;

    ${({ theme }) => theme.mediaQueries.sm} {
      height: 128px;
      width: 128px;
    }
  }
`

const ScoreHeading: React.FC<ScoreHeadingProps> = ({ profile }) => {
  return (
    <Wrapper>
      <LaurelWrapper>
        <Laurel dir="l" />
      </LaurelWrapper>
      <ProfileWrapper>
        <Sticker>{profile ? <ProfileAvatar profile={profile} /> : <NoProfileAvatarIcon />}</Sticker>
      </ProfileWrapper>
      <LaurelWrapper>
        <Laurel dir="r" />
      </LaurelWrapper>
    </Wrapper>
  )
}

export default ScoreHeading
