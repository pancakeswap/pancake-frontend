import styled from 'styled-components'
import { Flex, TwitterIcon, TelegramIcon, Link } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const StyledSocialIcon = styled(Flex)`
  position: static;
  top: 0px;
  right: 0px;
  height: 100%;
  padding-top: 0px;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.lg} {
    position: sticky;
    padding-top: 20px;
    flex-direction: column;
  }
`

const StyledLink = styled(Link)`
  &:hover {
    > svg {
      fill: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const SocialIcon = () => {
  const router = useRouter()
  return (
    <StyledSocialIcon>
      <StyledLink
        external
        mb={['0', '0', '0', '0', '28px']}
        mr={['28px', '28px', '28px', '28px', '0']}
        href={`https://twitter.com/share?url=https://blog.pancakeswap.finance${router.asPath}`}
      >
        <TwitterIcon width={40} />
      </StyledLink>
      <StyledLink external href={`https://telegram.me/share/url?url=https://blog.pancakeswap.finance${router.asPath}`}>
        <TelegramIcon width={40} />
      </StyledLink>
    </StyledSocialIcon>
  )
}

export default SocialIcon
