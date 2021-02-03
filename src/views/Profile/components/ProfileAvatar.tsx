import React from 'react'
import styled from 'styled-components'

const Avatar = styled.img`
  border-radius: 50%;
`

const StyledProfileAvatar = styled(Avatar)``

const TeamAvatar = styled(Avatar)`
  border: 1px solid ${({ theme }) => theme.card.background};
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

const AvatarWrapper = styled.div`
  margin-right: 16px;
  position: relative;
  width: 64px;

  & > img {
    border-radius: 50%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 128px;
  }
`

const ProfileAvatar = ({ profile }) => {
  return (
    <AvatarWrapper>
      <StyledProfileAvatar src={`/images/nfts/${profile.nft.previewImage}`} alt={profile.username} />
      <TeamAvatar src={`/images/teams/${profile.team.avatarImage}`} alt={profile.team.name} />
    </AvatarWrapper>
  )
}

export default ProfileAvatar
