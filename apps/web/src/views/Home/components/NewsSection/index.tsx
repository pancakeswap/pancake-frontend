import { useTranslation } from '@pancakeswap/localization'
import { ChevronLeftIcon, ChevronRightIcon, Flex, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { useRef, useCallback } from 'react'
import { useAllNewsArticle } from '../../hooks/useAllArticle'

const NewsCard = styled.div`
  vertical-align: top;
  width: 280px;
  height: 387px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
  display: inline-block;
  margin-right: 34px;
  cursor: pointer;
  scroll-snap-align: start;
  &:last-child {
    scroll-snap-align: end;
  }
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
  max-height: 56px;
`

const CardWrapper = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  border-radius: 24px;
  padding-bottom: 5px;
  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`
const ArrowButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  svg path {
    fill: ${({ theme }) => theme.colors.primary};
  }
  cursor: pointer;
`

export const NewsSection: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const scrollWrapper = useRef<HTMLDivElement>(null)
  const { articlesData, isFetching } = useAllNewsArticle()
  const onButtonClick = useCallback((scrollTo: 'next' | 'pre') => {
    const scrollTarget = scrollWrapper.current
    if (!scrollTarget) return
    if (scrollTo === 'next') {
      scrollTarget.scrollLeft += 280
      return
    }
    scrollTarget.scrollLeft -= 280
  }, [])
  return (
    <Flex flexDirection="column" style={{ gap: 36 }}>
      <Flex justifyContent="center" style={{ gap: 8 }}>
        <Text fontSize={40} fontWeight={600} textAlign="center">
          {t('Featured')}
        </Text>
        <Text fontSize={40} fontWeight={600} color="secondary" textAlign="center">
          {t('News')}
        </Text>
      </Flex>
      <Flex>
        <Flex alignItems="center" mr="8px">
          <ArrowButton>
            <ChevronLeftIcon onClick={() => onButtonClick('pre')} color={theme.colors.textSubtle} />
          </ArrowButton>
        </Flex>
        <CardWrapper ref={scrollWrapper}>
          {!isFetching &&
            articlesData?.data.map((d) => (
              <NewsCard
                onClick={() => {
                  window.open(d.newsOutBoundLink, '_blank', 'noopener noreferrer')
                }}
              >
                <ImageBox>
                  <img src={d.imgUrl} alt="" />
                </ImageBox>
                <ContentBox>
                  <Flex justifyContent="space-between">
                    <Text bold fontSize={12} color={theme.colors.textSubtle} lineHeight="120%">
                      {t('From')} [{d.newsFromPlatform}]
                    </Text>
                    <Text bold fontSize={12} color={theme.colors.textSubtle} lineHeight="120%">
                      {new Date(d.createAt).toLocaleString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric',
                      })}
                    </Text>
                  </Flex>
                  <Text bold mt="16px" lineHeight="120%" minHeight="66px" style={{ whiteSpace: 'pre-wrap' }}>
                    {d.title}
                  </Text>
                  <DescriptionBox>{d.description}</DescriptionBox>
                </ContentBox>
              </NewsCard>
            ))}
        </CardWrapper>
        <Flex alignItems="center" ml="8px">
          <ArrowButton>
            <ChevronRightIcon onClick={() => onButtonClick('next')} color={theme.colors.textSubtle} />
          </ArrowButton>
        </Flex>
      </Flex>
    </Flex>
  )
}
