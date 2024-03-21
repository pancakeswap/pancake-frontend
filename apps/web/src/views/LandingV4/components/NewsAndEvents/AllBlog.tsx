import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, OptionProps, Select, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { GradientBox } from 'views/LandingV4/components/GradientBox'
import { AllBlogIcon } from 'views/LandingV4/components/Icons/AllBlogIcon'
import { BlogCard } from 'views/LandingV4/components/NewsAndEvents/BlogCard'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'
import { V4ArticleDataType } from 'views/LandingV4/config/types'
import { MIN_DISPLAY, useTotalGradientBox } from 'views/LandingV4/hooks/totalGradientBox'
import { useV4Articles, useV4NewsArticle } from 'views/LandingV4/hooks/useAllArticle'

const AllBlogContainer = styled(FlexGap)`
  gap: 24px;
  flex-wrap: wrap;
  margin: 24px 0;

  > a,
  > div {
    width: 100%;
    align-self: flex-start;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > a,
    > div {
      width: calc(50% - 12px);
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > a,
    > div {
      width: calc(33.33% - 16px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > a,
    > div {
      width: calc(25% - 18px);
    }
  }
`

const SelectStyled = styled(Select)`
  min-width: 132px;

  > div {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
`

enum SortOption {
  ALL_BLOG = 0,
  OFFICIAL = 1,
  THIRD_PARTY = 2,
}

export const AllBlog = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [sortOption, setSortOption] = useState(SortOption.ALL_BLOG)
  const [isClickedMoreButton, setIsClickedMoreButton] = useState(false)

  const { articlesData: v4Articles } = useV4Articles()
  const { articlesData: v4NewsData } = useV4NewsArticle()

  const options = useMemo(() => {
    return [
      {
        label: t('All Sources'),
        value: SortOption.ALL_BLOG,
      },
      {
        label: t('Official'),
        value: SortOption.OFFICIAL,
      },
      {
        label: t('Third Party'),
        value: SortOption.THIRD_PARTY,
      },
    ]
  }, [t])

  const handleSort = (option: OptionProps) => {
    setSortOption(option.value)
  }

  const allBlogData = useMemo(() => {
    let data: V4ArticleDataType[] = []
    const officialBlog = v4Articles.data

    if (sortOption === SortOption.OFFICIAL) {
      data = [...officialBlog]
    }

    if (sortOption === SortOption.THIRD_PARTY) {
      data = [...v4NewsData.data]
    }

    if (sortOption === SortOption.ALL_BLOG) {
      data = [...officialBlog, ...v4NewsData.data]
    }

    return data.sort((a, b) => new Date(b?.publishedAt).getTime() - new Date(a?.publishedAt).getTime())
  }, [sortOption, v4Articles.data, v4NewsData.data])

  const filterData = useMemo(
    () => (isClickedMoreButton ? allBlogData : allBlogData.slice(0, MIN_DISPLAY)),
    [allBlogData, isClickedMoreButton],
  )

  // Calculate need how many gradient box
  const totalGradientBox = useTotalGradientBox({ isClickedMoreButton, dataLength: filterData.length })

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
          <SelectStyled
            options={options}
            placeHolderText={t('All Sources')}
            onOptionChange={(option: OptionProps) => handleSort(option)}
          />
        </Flex>
      </Flex>
      <AllBlogContainer>
        {filterData.map((article) => (
          <BlogCard
            key={article.id}
            isAllBlog
            article={article}
            imgUrl={article.imgUrl}
            slug={article.slug}
            imgHeight={['160px']}
          />
        ))}
        {totalGradientBox?.map((i) => (
          <GradientBox key={i} />
        ))}
      </AllBlogContainer>
      {!isClickedMoreButton && allBlogData.length > MIN_DISPLAY && (
        <ViewMoreButton onClick={() => setIsClickedMoreButton(true)} />
      )}
    </Box>
  )
}
