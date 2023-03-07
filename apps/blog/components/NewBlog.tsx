import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { useMemo } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { ArticleDataType } from 'utils/transformArticle'
import { StyledLineClamp } from 'components/StyledLineClamp'

const StyledBackground = styled(Box)`
  position: relative;
  padding: 45px 16px 0 16px;
`

const StyledGradientBg = styled('div')`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 65%;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
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

const NewBlog = () => {
  const { t } = useTranslation()
  const { data: articlesData } = useSWR<ArticleDataType[]>('/latestArticles')
  const article = useMemo(() => articlesData?.[0], [articlesData])

  return (
    <StyledBackground>
      <StyledGradientBg />
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
        <NextLink passHref href={`/articles/${article?.slug}`}>
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
              <StyledLineClamp
                bold
                ellipsis
                line={2}
                lineHeight={['1.5', '1.2']}
                mb={['8px', '8px', '8px', '24px']}
                fontSize={['16px', '24px', '24px', '24px', '24px', '48px']}
              >
                {article?.title}
              </StyledLineClamp>
              <Text display={['none', 'none', 'none', 'block']} ellipsis mb="24px">
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
