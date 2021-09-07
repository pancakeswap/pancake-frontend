import React from 'react'
import styled from 'styled-components'
import { NoProfileAvatarIcon, LaurelLeftIcon, LaurelRightIcon, Skeleton } from '@pancakeswap/uikit'
import ProfileAvatarWithTeam from 'components/ProfileAvatarWithTeam'
import { YourScoreProps } from '../../types'
import Sticker from '../Sticker'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LaurelWrapper = styled.div<{ dir?: 'left' | 'right' }>`
  transform: ${({ dir }) => (dir === 'left' ? 'rotate(30deg)' : 'rotate(-30deg)')};
  svg {
    fill: #27262c;
    opacity: 0.5;
    height: 32px;
    width: auto;
    ${({ theme }) => theme.mediaQueries.sm} {
      height: 45px;
    }
  }
`

const ProfileWrapper = styled.div`
  height: 96px;
  width: 96px;
`

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const ScoreHeader: React.FC<YourScoreProps> = ({ profile, isLoading }) => {
  return (
    <Wrapper>
      <LaurelWrapper dir="left">
        <LaurelLeftIcon />
      </LaurelWrapper>
      {isLoading ? (
        <Skeleton height="96px" width="96px" variant="circle" />
      ) : (
        <ProfileWrapper>
          <Sticker>{profile ? <ProfileAvatarWithTeam profile={profile} /> : <StyledNoProfileAvatarIcon />}</Sticker>
        </ProfileWrapper>
      )}

      <LaurelWrapper dir="right">
        <LaurelRightIcon />
      </LaurelWrapper>
    </Wrapper>
  )
}

export default ScoreHeader
