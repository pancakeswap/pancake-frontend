import React from 'react'
import { Profile } from 'state/types'
import styled from 'styled-components'

interface ProfileAvatarProps {
  profile: Profile
}

const TeamAvatar = styled.img`
  border: 1px solid ${({ theme }) => theme.card.background};
  border-radius: 50%;
  bottom: 0px;
  height: 24px;
  position: absolute;
  right: 0px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 2px;
    height: 48px;
    width: 48px;
  }
`

const AvatarWrapper = styled.div<{ bg: string }>`
  background: url('${({ bg }) => bg}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 64px;
  margin-right: 16px;
  position: relative;
  width: 64px;

  & > img {
    border-radius: 50%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  return (
    <AvatarWrapper bg={`/images/nfts/${profile.nft.images.md}`}>
      <TeamAvatar src={`/images/teams/${profile.team.images.alt}`} alt={profile.team.name} />
    </AvatarWrapper>
  )
}

export default ProfileAvatar
