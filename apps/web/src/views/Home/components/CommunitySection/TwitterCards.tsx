import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, LogoIcon, OpenNewIcon, Text, VerifiedIcon } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useMemo } from 'react'
import styled from 'styled-components'

export const Wrapper = styled.div`
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  /* Card/Dark Drop Shadow */
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
  padding: 24px;
  width: 355px;
  height: 338px;
  transform: rotate(2deg);
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

const TwitterCards: React.FC = () => {
  const { t } = useTranslation()
  const tweets = useTweetsData()
  const { theme } = useTheme()
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

      <Flex style={{ gap: 8 }}>
        <Text fontSize={14} color={theme.colors.textSubtle}>
          @PancakeSwap
        </Text>
        <Text fontSize={14} color={theme.isDark ? '#A881FC' : theme.colors.secondary}>
          {tweets[0].date}
        </Text>
        <Text fontSize={14} color={theme.colors.textSubtle}>
          {tweets[0].like}
        </Text>
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

export default TwitterCards
