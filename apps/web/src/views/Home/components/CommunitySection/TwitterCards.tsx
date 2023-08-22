import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  Link,
  LogoIcon,
  OpenNewIcon,
  Text,
  VerifiedIcon,
  FavoriteBorderIcon,
  BarChartIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useMemo } from 'react'
import styled from 'styled-components'

export const BlogImage = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 16px;
  background-size: cover;
`
export const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  border-radius: 25%;
  margin: 0 8px;
`

export const Wrapper = styled.div`
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  /* Card/Dark Drop Shadow */
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
  padding: 24px;
  width: 100%;
  height: 345px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 340px;
  }
`

const LogoBox = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  justify-content: center;
  background: linear-gradient(180deg, #53dee9 0%, #1fc7d4 100%);
`

const TweetWrapper = styled.div`
  overflow: hidden;
  margin-top: 5px;
`
const TweetBox = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
`

export const useTweetsData = () => {
  return useMemo(() => {
    return [
      {
        tweet: `👋 Say hello to a convenient on-ramp experience! 📈
🥞 At PancakeSwap, we've got you covered!  Purchase cryptocurrencies directly from our platform using your preferred fiat currency. 🎉`,
        link: 'https://twitter.com/PancakeSwap/status/1682993409273876480?s=20',
        date: 'July 23',
        like: '365',
        impression: '49.7k',
      },
    ]
  }, [])
}

export const useLatestBlogData = () => {
  return useMemo(() => {
    return {
      title: 'Step by Step Guide to Use Arbitrum PancakeSwap v3',
      imageSrc: 'https://sgp1.digitaloceanspaces.com/strapi.space/b477fb73428ef9accc2b312873e9140c.jpg',
      link: 'https://blog.pancakeswap.finance/articles/step-by-step-guide-to-use-arbitrum-one-pancake-swap-v3',
      date: 'Aug 10, 2023',
    }
  }, [])
}

const mobileStyle: React.CSSProperties = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: 33,
  overflow: 'hidden',
}

export const TwitterCards: React.FC = () => {
  const { t } = useTranslation()
  const tweets = useTweetsData()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  return (
    <Wrapper>
      <Text bold mb="24px">
        {t('Top Tweet of the week')}
      </Text>
      <LogoBox>
        <LogoIcon width={30} />
      </LogoBox>
      <Flex alignItems="center">
        <Text mt="10px" fontSize={14} bold>
          PancakeSwap🥞Ev3ryone&#39;s Favourite D3X
        </Text>
        <VerifiedIcon ml="3px" mt="9px" color={theme.colors.secondary} />
      </Flex>
      <Flex style={{ gap: 0 }} alignItems="center" justifyContent="center">
        <Text fontSize={14} color={theme.colors.textSubtle} style={isMobile ? mobileStyle : undefined}>
          @PancakeSwap
        </Text>
        <Divider />
        <Text fontSize={14} color={theme.isDark ? '#A881FC' : theme.colors.secondary}>
          {tweets[0].date}
        </Text>
        <Divider />
        <FavoriteBorderIcon fontSize={14} color={theme.colors.textSubtle} />
        <Text fontSize={14} color={theme.colors.textSubtle}>
          {tweets[0].like}
        </Text>
        <Divider />
        <BarChartIcon color={theme.colors.textSubtle} />
        <Text fontSize={14} color={theme.colors.textSubtle}>
          {tweets[0].impression}
        </Text>
      </Flex>
      <TweetWrapper>
        <TweetBox>{tweets[0].tweet}</TweetBox>
      </TweetWrapper>
      <Link external href={tweets[0].link} marginTop="5px">
        {t('Web link')} <OpenNewIcon ml="3px" color="primary" />
      </Link>
    </Wrapper>
  )
}

export const BlogCard: React.FC = () => {
  const { t } = useTranslation()
  const { imageSrc, title, date, link } = useLatestBlogData()
  const { theme } = useTheme()
  return (
    <Wrapper
      onClick={() => {
        window.open(link, '_blank', 'noopener noreferrer')
      }}
      style={{ cursor: 'pointer' }}
    >
      <Text bold mb="24px">
        {t('Our Latest Blog')}
      </Text>
      <BlogImage style={{ backgroundImage: `url(${imageSrc})` }} />
      <Text mt="8px" fontSize={14} color={theme.colors.textSubtle} textAlign="right">
        {date}
      </Text>
      <Text mt="10px" fontSize={14} bold>
        {title}
      </Text>
    </Wrapper>
  )
}
