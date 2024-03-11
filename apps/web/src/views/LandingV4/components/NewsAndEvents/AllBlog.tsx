import { useTranslation } from '@pancakeswap/localization'
import { AllBlogIcon, Box, Flex, OptionProps, Select, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { BlogCard } from 'views/LandingV4/components/NewsAndEvents/BlogCard'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'

const AllBlogContainer = styled(Flex)`
  flex-wrap: wrap;
  margin-top: 24px;

  > div {
    width: 100%;
    margin-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 12px);
      margin-right: 24px;
    }

    > div:nth-child(2n + 0) {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      width: calc(33.33% - 16px);
      margin-right: 24px;
    }

    > div:nth-child(2n + 0) {
      margin-right: 24px;
    }

    > div:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      width: calc(25% - 18px);
      margin-right: 24px;
    }

    > div:nth-child(3n + 0) {
      margin-right: 24px;
    }

    > div:nth-child(4n + 0) {
      margin-right: 0;
    }
  }
`

export const AllBlog = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [sortOption, setSortOption] = useState(0)

  const options = useMemo(() => {
    return [
      {
        label: t('All Sources'),
        value: 0,
      },
      {
        label: t('Official Blog'),
        value: 1,
      },
      {
        label: t('Third Party'),
        value: 2,
      },
    ].filter((i) => i.value !== sortOption)
  }, [t, sortOption])

  const handleSort = (option: OptionProps) => {
    setSortOption(option.value)
  }

  return (
    <Box mt="16px">
      <Flex>
        <AllBlogIcon width={isDesktop ? 32 : 28} height={isDesktop ? 32 : 28} color="secondary" />
        <Text ml="8px" bold fontSize={['24px', '24px', '24px', '36px']}>
          {t('All')}
        </Text>
        <Flex ml="auto" alignSelf="center">
          <Text width="100%" style={{ alignSelf: 'center' }} mr="8px">
            {t('News from:')}
          </Text>
          <Select
            style={{ background: 'black' }}
            options={options}
            placeHolderText={t('All Sources')}
            onOptionChange={(option: OptionProps) => handleSort(option.value)}
          />
        </Flex>
      </Flex>
      <AllBlogContainer>
        <BlogCard isAllBlog imgHeight={['160px']} />
        <BlogCard isAllBlog imgHeight={['160px']} />
        <BlogCard isAllBlog imgHeight={['160px']} />
        <BlogCard isAllBlog imgHeight={['160px']} />
      </AllBlogContainer>
      <ViewMoreButton />
    </Box>
  )
}
