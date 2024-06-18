import { NoProfileAvatarIcon } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Profile } from 'state/types'
import { styled } from 'styled-components'

export interface ProfileAvatarProps {
  profile: Profile
}

const TeamAvatar = styled.img`
  border: 1px solid ${({ theme }) => theme.card.background};
  border-radius: 50%;
  bottom: 0px;
  position: absolute;
  right: 0px;
  min-width: 20px;
  min-height: 20px;
  width: 37.5%;
  height: 37.5%;
  z-index: 5;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 2px;
  }
`

const AvatarWrapper = styled.div<{ $bg?: string }>`
  ${({ $bg }) =>
    $bg &&
    `
    background: url('${$bg}');
  `}
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 100%;
  height: 100%;

  & > img {
    border-radius: 50%;
  }
`
// TODO: replace with no profile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const ProfileAvatarWithTeam: React.FC<React.PropsWithChildren<ProfileAvatarProps>> = ({ profile }) => {
  return (
    <AvatarWrapper $bg={profile.nft?.image.thumbnail}>
      {!profile.isActive && <AvatarInactive />}
      {profile.team && <TeamAvatar src={`${ASSET_CDN}/web/teams/${profile.team.images.alt}`} alt={profile.team.name} />}
    </AvatarWrapper>
  )
}

export default ProfileAvatarWithTeam
