import { Heading, Flex, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'

export const newsData = [
  {
    platform: 'cointelegraph',
    title: 'PancakeSwap wants to cap token inflation rate at 3%–5% per year',
    description:
      'Decentralized exchange (DEX) PancakeSwap wants to lower its token inflation to anywhere between 3% and 5% per annum, far below current rates of over 20%.',
    imageSrc:
      'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjMtMDQvOWYxOGU4YjMtM2M0Ni00YjkxLTkzMDktM2RmNGU0ZGZjOWIwLmpwZw==.jpg',
    link: 'https://cointelegraph.com/news/pancakeswap-wants-to-cap-token-inflation-rate-between-3-to-5-per-annum',
    date: '2023-04-18',
  },
  {
    platform: 'cointelegraph',
    title: 'PancakeSwap wants to cap token inflation rate at 3%–5% per year',
    description:
      'Decentralized exchange (DEX) PancakeSwap wants to lower its token inflation to anywhere between 3% and 5% per annum, far below current rates of over 20%.',
    imageSrc:
      'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjMtMDQvOWYxOGU4YjMtM2M0Ni00YjkxLTkzMDktM2RmNGU0ZGZjOWIwLmpwZw==.jpg',
    link: 'https://cointelegraph.com/news/pancakeswap-wants-to-cap-token-inflation-rate-between-3-to-5-per-annum',
    date: '2023-04-18',
  },
  {
    platform: 'cointelegraph',
    title: 'PancakeSwap wants to cap token inflation rate at 3%–5% per year',
    description:
      'Decentralized exchange (DEX) PancakeSwap wants to lower its token inflation to anywhere between 3% and 5% per annum, far below current rates of over 20%.',
    imageSrc:
      'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjMtMDQvOWYxOGU4YjMtM2M0Ni00YjkxLTkzMDktM2RmNGU0ZGZjOWIwLmpwZw==.jpg',
    link: 'https://cointelegraph.com/news/pancakeswap-wants-to-cap-token-inflation-rate-between-3-to-5-per-annum',
    date: '2023-04-18',
  },
  {
    platform: 'cointelegraph',
    title: 'PancakeSwap wants to cap token inflation rate at 3%–5% per year',
    description:
      'Decentralized exchange (DEX) PancakeSwap wants to lower its token inflation to anywhere between 3% and 5% per annum, far below current rates of over 20%.',
    imageSrc:
      'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjMtMDQvOWYxOGU4YjMtM2M0Ni00YjkxLTkzMDktM2RmNGU0ZGZjOWIwLmpwZw==.jpg',
    link: 'https://cointelegraph.com/news/pancakeswap-wants-to-cap-token-inflation-rate-between-3-to-5-per-annum',
    date: '2023-04-18',
  },
]

const NewsCard = styled.div`
  width: 280px;
  height: 387px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: 0px 2px 0px 0px #383241;
  display: inline-block;
  margin-right: 34px;
  cursor: pointer;
`
const ImageBox = styled.div`
  height: 200px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
  }
`
const ContentBox = styled.div`
  height: 187px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-top: none;
  padding: 20px;
`

const DescriptionBox = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  font-size: 9px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-top: 16px;
`

const CardWrapper = styled.div`
  white-space: nowrap;
  overflow-x: hidden;
`

export const NewsSection: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" style={{ gap: 36 }}>
      <Heading color="#7645D9" scale="xl">
        {t('Featured News')}
      </Heading>
      <CardWrapper>
        {newsData.map((d) => (
          <NewsCard
            onClick={() => {
              window.open(d.link, '_blank', 'noopener noreferrer')
            }}
          >
            <ImageBox>
              <img src={d.imageSrc} alt="" />
            </ImageBox>
            <ContentBox>
              <Flex justifyContent="space-between">
                <Text bold fontSize={12} color={theme.colors.textSubtle} lineHeight="120%">
                  {t('From')} [{d.platform}]
                </Text>
                <Text bold fontSize={12} color={theme.colors.textSubtle} lineHeight="120%">
                  {new Date(d.date).toLocaleString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}
                </Text>
              </Flex>
              <Text bold mt="20px" lineHeight="120%" style={{ whiteSpace: 'pre-wrap' }}>
                {d.title}
              </Text>
              <DescriptionBox>{d.description}</DescriptionBox>
            </ContentBox>
          </NewsCard>
        ))}
      </CardWrapper>
    </Flex>
  )
}
