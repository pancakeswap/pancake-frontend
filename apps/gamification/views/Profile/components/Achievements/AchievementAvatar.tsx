import { BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { ImgHTMLAttributes } from 'react'
import { styled } from 'styled-components'

interface AchievementAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  badge?: string
}

const NoBadgePlaceholder = styled(BunnyPlaceholderIcon)`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const StyledAchievementAvatar = styled.img`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const AchievementAvatar: React.FC<React.PropsWithChildren<AchievementAvatarProps>> = ({ badge, ...props }) => {
  if (!badge) {
    return <NoBadgePlaceholder />
  }

  return <StyledAchievementAvatar src={`${ASSET_CDN}/web/achievements/${badge}`} alt="achievement badge" {...props} />
}

export default AchievementAvatar
