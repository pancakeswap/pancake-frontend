import { useTranslation } from '@pancakeswap/localization'
import {
  BarChartIcon,
  FavoriteBorderIcon,
  Flex,
  Link,
  LogoIcon,
  OpenNewIcon,
  Text,
  VerifiedIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { useLatestArticle } from '../../hooks/useAllArticle'

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
        tweet: `Get Your Uniswap Interface Fees Refunded on PancakeSwap, up to $8M!

Match your Ethereum Uniswap volume 1:1 on Ethereum PancakeSwap, and we’ll refund ALL your interface fees paid.
Trade now: https://pancakeswap.finance/swap?chain=eth&utm_source=twitter&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund
`,
        link: 'https://x.com/PancakeSwap/status/1791076335462314097',
        date: 'May 16',
        like: '1k',
        impression: '295.5k',
      },
    ]
  }, [])
}

const StyledText = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 23px;
  overflow: hidden;
  @media screen and (max-width: 420px) and (min-width: 320px) {
    width: 50px;
  }
  @media screen and (max-width: 576px) and (min-width: 421px) {
    width: 76px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
  @media screen and (max-width: 762px) and (min-width: 700px) {
    width: 66px;
  }
`

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
        <StyledText fontSize={14} color={theme.colors.textSubtle}>
          @PancakeSwap
        </StyledText>
        <Divider />
        <Text fontSize={14} color={theme.colors.textSubtle}>
          {tweets[0].date}
        </Text>
        <Divider />
        <FavoriteBorderIcon width={isMobile ? 14 : 16} color={theme.colors.textSubtle} mr="2px" />
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
  const { articlesData } = useLatestArticle()
  const { theme } = useTheme()
  return (
    <Wrapper
      onClick={() => {
        window.open(
          `https://blog.pancakeswap.finance/articles/${articlesData?.data?.[0]?.slug ?? ''}`,
          '_blank',
          'noopener noreferrer',
        )
      }}
      style={{ cursor: 'pointer' }}
    >
      <Text bold mb="24px">
        {t('Latest Blog Post')}
      </Text>
      <BlogImage style={{ backgroundImage: `url(${articlesData?.data?.[0]?.imgUrl ?? ''})` }} />
      <Text mt="8px" fontSize={14} color={theme.colors.textSubtle} textAlign="left">
        {articlesData?.data?.[0]?.createAt ?? ''}
      </Text>
      <Text mt="10px" fontSize={14} bold>
        {articlesData?.data?.[0]?.title ?? ''}
      </Text>
    </Wrapper>
  )
}
