import { useMemo } from 'react'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import BlogCard from 'views/Blog/components/BlogCard'
import styled from 'styled-components'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import NextLink from 'next/link'
import useSWR from 'swr'
import { ArticleDataType } from 'views/Blog/utils/transformArticle'
import SearchBar from 'views/Blog/components/SearchBar'

const StyledBackground = styled(Box)<{ isDark: boolean }>`
  position: relative;
  padding: 45px 16px 0 16px;

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    background: ${({ isDark }) => (isDark ? NEW_BLOG_BG_DARK : NEW_BLOG_BG)};
    border-bottom-left-radius: 50% 5%;
    border-bottom-right-radius: 50% 5%;
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
    <StyledBackground isDark={isDark}>
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
          <SearchBar />
        </Flex>
        <NextLink
          passHref
          href={`/blog/article/${article?.id}`}
          style={{ display: 'flex', maxWidth: '880px', margin: 'auto' }}
        >
          <BlogCard
            width="100%"
            imgHeight={['155px', '250px', '350px', '500px']}
            article={article}
            imgUrl={article?.imgUrl ?? ''}
          />
        </NextLink>
      </Box>
    </StyledBackground>
  )
}

export default NewBlog
