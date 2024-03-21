import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, HotIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { BlogCard } from 'views/LandingV4/components/NewsAndEvents/BlogCard'
import { useV4Featured } from 'views/LandingV4/hooks/useAllArticle'

const FeaturedBlog = styled(Flex)`
  flex-wrap: wrap;
  justify-content: space-between;
  align-self: stretch;

  > a, >div {
    display: -webkit-inline-box !important;
    width: 100%;
    margin-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > a, >div {
      width: calc(50% - 12px);
      margin-bottom: 24px;
    }

    >a: first-child, >div: first-child, {
      width: 100%;
    }
  }
`

export const Featured = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { articlesData, isFetching } = useV4Featured()

  return (
    <Box>
      <Flex mb="24px">
        <HotIcon width={isDesktop ? 32 : 28} height={isDesktop ? 32 : 28} color="secondary" />
        <Text ml="8px" bold fontSize={['24px', '24px', '24px', '36px']}>
          {t('Featured')}
        </Text>
      </Flex>
      <FeaturedBlog>
        {!isFetching &&
          articlesData?.data?.map((article, index) => (
            <BlogCard
              key={article.id}
              isSpecialLayout={index === 0}
              article={article}
              imgUrl={article.imgUrl}
              slug={article.slug}
              imgHeight={['200px', '200px', '200px', '200px', '330px']}
            />
          ))}
      </FeaturedBlog>
    </Box>
  )
}
