import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import ProfileAvatar from '../../../Profile/components/ProfileAvatar'

interface ScoreHeadingProps {
  profile: Profile
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 64px;
    width: 64px;

    ${({ theme }) => theme.mediaQueries.sm} {
      height: 128px;
      width: 128px;
    }
  }
`

const Laurel: React.FC<{ dir: string; src: string }> = styled.img`
  ${({ dir }) =>
    dir === 'l'
      ? `
  transform: scaleX(-1);
  margin-right: 8px;
  `
      : 'margin-left: 8px;'}
  height: 32px;
  width: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
  }
`

const ScoreHeading: React.FC<ScoreHeadingProps> = ({ profile }) => {
  return (
    <Wrapper>
      <Laurel dir="l" src="/images/laurel.svg" />
      {profile ? <ProfileAvatar profile={profile} border /> : <NoProfileAvatarIcon />}
      <Laurel dir="r" src="/images/laurel.svg" />
    </Wrapper>
  )
}

export default ScoreHeading
