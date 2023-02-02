import { useMemo } from 'react'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import NextLink from 'next/link'
import useSWR from 'swr'
import { ArticleDataType } from 'views/Blog/utils/transformArticle'
import NoSSR from 'components/NoSSR'

const StyledBackground = styled(Box)`
  position: relative;
  padding: 45px 16px 0 16px;
`

const StyledGradientBg = styled('div')<{ isDark: boolean }>`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 65%;
  background: ${({ isDark }) => (isDark ? NEW_BLOG_BG_DARK : NEW_BLOG_BG)};
  border-bottom-left-radius: 50% 5%;
  border-bottom-right-radius: 50% 5%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 90%;
  }
`
const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyleBlog = styled(Flex)`
  max-width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }

  &:hover ${StyledBackgroundImage} {
    opacity: 0.8;
    transform: scale(1.05);
  }
`

const StyledTagGroup = styled(Flex)`
  flex-wrap: wrap;

  ${Text} {
    &:after {
      content: ',';
      margin: 0 4px;
    }

    &:last-child {
      &:after {
        content: '';
      }
    }
  }
`

const NEW_BLOG_BG = 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
const NEW_BLOG_BG_DARK = 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)'

const NewBlog = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { data: articlesData } = useSWR<ArticleDataType[]>('/latestArticles')
  const article = useMemo(() => articlesData?.[0], [articlesData])

  return (
    <StyledBackground>
      <NoSSR>
        <StyledGradientBg isDark={isDark} />
      </NoSSR>
      <Box maxWidth="1137px" margin="auto">
        <Flex flexDirection={['column', 'column', 'column', 'row']}>
          <Box>
            <Text bold fontSize={['32px', '32px', '40px']}>
              {t('Blog')}
            </Text>
            <Text bold mt="4px" mb={['20px', '20px', '35px']} color="textSubtle" fontSize={['14px', '14px', '16px']}>
              {t('Latest News about PancakeSwap and more!')}
            </Text>
          </Box>
        </Flex>
        <NextLink passHref href={`/${article?.id}`}>
          <StyleBlog>
            <Box
              overflow="hidden"
              borderRadius={8}
              mr={['0', '0', '0', '0', '0', '50px']}
              minWidth={['152px', '192px', '488px']}
              height={['200px', '228px', '420px', '530px', '530px', '275px']}
            >
              <StyledBackgroundImage imgUrl={article?.imgUrl ?? ''} />
            </Box>
            <Flex
              overflow="hidden"
              flexDirection="column"
              width="100%"
              mt={['16px', '16px', '20px', '40px', '40px', '0']}
            >
              <Box mb="24px" display={['none', null, null, 'block']}>
                <StyledTagGroup>
                  {article?.categories?.map((category: string) => (
                    <Text bold key={category} fontSize="12px" color="textSubtle" textTransform="uppercase">
                      {category}
                    </Text>
                  ))}
                </StyledTagGroup>
              </Box>
              <Text
                ellipsis
                bold
                lineHeight="100%"
                mb={['8px', '8px', '8px', '24px']}
                fontSize={['16px', '24px', '24px', '24px', '24px', '48px']}
              >
                {article?.title}
              </Text>
              <Text ellipsis mb="24px">
                {article?.description}
              </Text>
              <Text fontSize={['12px', '12px', '14px']} color="textSubtle">
                {article?.createAt}
              </Text>
            </Flex>
          </StyleBlog>
        </NextLink>
      </Box>
    </StyledBackground>
  )
}

export default NewBlog
