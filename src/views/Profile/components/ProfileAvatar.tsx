import React from 'react'
import { NoProfileAvatarIcon } from '@pancakeswap-libs/uikit'
import { Profile } from 'state/types'
import styled from 'styled-components'

export interface ProfileAvatarProps {
  profile: Profile
  border?: boolean
}

const TeamAvatar = styled.img`
  border: 1px solid ${({ theme }) => theme.card.background};
  border-radius: 50%;
  bottom: 0px;
  height: 24px;
  position: absolute;
  right: 0px;
  width: 24px;
  z-index: 5;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 2px;
    height: 48px;
    width: 48px;
  }
`

const AvatarWrapper = styled.div<{ bg: string; border: boolean }>`
  background: url('${({ bg }) => bg}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  ${({ border, theme }) => (border ? `border: 2px solid ${theme.colors.invertedContrast};` : '')}
  height: 64px;
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
// TODO: replace with no provile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile, border = false }) => {
  return (
    <AvatarWrapper border={border} bg={`/images/nfts/${profile.nft?.images?.md}`}>
      {!profile.isActive && <AvatarInactive />}
      <TeamAvatar src={`/images/teams/${profile.team.images.alt}`} alt={profile.team.name} />
    </AvatarWrapper>
  )
}

export default ProfileAvatar
