import styled from 'styled-components'
import { useMemo, cloneElement } from 'react'
import {
  TwitterIcon,
  TelegramIcon,
  DiscordIcon,
  InstagramIcon,
  RedditIcon,
  YoutubeIcon,
  Link,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const CommunityWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  gap: 12px;
  justify-content: center;
`
const FollowTag = styled.div`
  border-radius: 32px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 12px;
`
const CommunityTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  width: 32px;
  height: 32px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 48px;
    height: 48px;
  }
`
const useCommunityData = () => {
  return useMemo(() => {
    return [
      { icon: <TwitterIcon />, href: 'https://twitter.com/pancakeswap', alt: 'TwitterIcon' },
      { icon: <TelegramIcon />, href: 'https://t.me/pancakeswap', alt: 'TelegramIcon' },
      { icon: <DiscordIcon />, href: 'https://discord.gg/pancakeswap', alt: 'DiscordIcon' },
      { icon: <InstagramIcon />, href: 'https://www.instagram.com/pancakeswap_official/', alt: 'InstagramIcon' },
      { icon: <RedditIcon />, href: 'https://www.reddit.com/r/pancakeswap/', alt: 'RedditIcon' },
      { icon: <YoutubeIcon />, href: 'https://www.youtube.com/@pancakeswap_official', alt: 'YoutubeIcon' },
    ]
  }, [])
}

export const CommunityTags: React.FC = () => {
  const communityData = useCommunityData()
  const { theme } = useTheme()
  return (
    <CommunityWrapper>
      {communityData.map((item) => (
        <Link href={item.href} key={item.alt} external>
          <CommunityTag>{cloneElement(item.icon, { color: theme.colors.primary, width: 18 })}</CommunityTag>
        </Link>
      ))}
    </CommunityWrapper>
  )
}
