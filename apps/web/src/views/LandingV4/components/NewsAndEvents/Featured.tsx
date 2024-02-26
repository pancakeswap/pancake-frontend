import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, HotIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { BlogCard } from 'views/LandingV4/components/NewsAndEvents/BlogCard'

const FeaturedBlog = styled(Flex)`
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    width: 100%;
    margin-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > div {
      width: calc(50% - 12px);
      margin-bottom: 24px;
    }

    >div: first-child {
      width: 100%;
    }
  }
`

export const Featured = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Box>
      <Flex>
        <HotIcon width={isDesktop ? 32 : 28} height={isDesktop ? 32 : 28} color="secondary" />
        <Text ml="8px" bold fontSize={['24px', '24px', '24px', '36px']}>
          {t('Featured')}
        </Text>
      </Flex>
      <FeaturedBlog>
        <BlogCard isSpecialLayout />
        <BlogCard />
        <BlogCard />
      </FeaturedBlog>
    </Box>
  )
}
