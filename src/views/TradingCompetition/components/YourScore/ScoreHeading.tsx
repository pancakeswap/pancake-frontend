import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon, Flex } from '@pancakeswap-libs/uikit'
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

const ProfilePicWrapper = styled(Flex)` */
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border: 2px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const ScoreHeading: React.FC<ScoreHeadingProps> = ({ profile }) => {
  return (
    <Wrapper>
      <Laurel dir="l" src="/images/competition/laurel.svg" />
      <ProfilePicWrapper>{profile ? <ProfileAvatar profile={profile} /> : <NoProfileAvatarIcon />}</ProfilePicWrapper>
      <Laurel dir="r" src="/images/competition/laurel.svg" />
    </Wrapper>
  )
}

export default ScoreHeading
