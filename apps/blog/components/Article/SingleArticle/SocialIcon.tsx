import styled from 'styled-components'
import { Flex, TwitterIcon, TelegramIcon, RedditIcon, Link, DiscordIcon } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const StyledLink = styled(Link)`
  &:hover {
    > svg {
      fill: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const StyledSocialIcon = styled(Flex)`
  position: static;
  top: 0px;
  right: 0px;
  height: 100%;
  padding-top: 0px;
  flex-direction: row;

  ${StyledLink} {
    margin: 0 28px 0 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    position: sticky;
    padding-top: 20px;
    flex-direction: column;

    ${StyledLink} {
      margin: 0 0 28px 0;
    }
  }
`

const BLOG_URL = 'https://blog.pancakeswap.finance'

const SocialIcon = () => {
  const router = useRouter()
  return (
    <StyledSocialIcon>
      <StyledLink external href={`https://twitter.com/share?url=${BLOG_URL}${router.asPath}`}>
        <TwitterIcon width={40} />
      </StyledLink>
      <StyledLink external href={`https://telegram.me/share/url?url=${BLOG_URL}${router.asPath}`}>
        <TelegramIcon width={40} />
      </StyledLink>
      <StyledLink external href={`https://reddit.com/submit?url=${BLOG_URL}${router.asPath}`}>
        <RedditIcon width={40} />
      </StyledLink>
      <StyledLink external href="https://discord.com/invite/pancakeswap">
        <DiscordIcon width={40} />
      </StyledLink>
    </StyledSocialIcon>
  )
}

export default SocialIcon
