import { useTranslation } from '@pancakeswap/localization'
import { AllBlogIcon, Box, Flex, FlexGap, OptionProps, Select, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { GradientBox } from 'views/LandingV4/components/GradientBox'
import { BlogCard } from 'views/LandingV4/components/NewsAndEvents/BlogCard'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'
import { useTotalGradientBox } from 'views/LandingV4/hooks/totalGradientBox'

const AllBlogContainer = styled(FlexGap)`
  gap: 24px;
  flex-wrap: wrap;
  margin: 24px 0;

  > div {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 12px);
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      width: calc(33.33% - 16px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
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

export const AllBlog = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [sortOption, setSortOption] = useState(0)
  const fakeData = [1, 2, 3, 4]
  const [isClickedMoreButton, setIsClickedMoreButton] = useState(false)

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

  // Calculate need how many gradient box
  const totalGradientBox = useTotalGradientBox({ isClickedMoreButton, dataLength: fakeData.length })

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
            onOptionChange={(option: OptionProps) => handleSort(option.value)}
          />
        </Flex>
      </Flex>
      <AllBlogContainer>
        {fakeData.map((i) => (
          <BlogCard key={i} isAllBlog imgHeight={['160px']} />
        ))}
        {totalGradientBox?.map((i) => (
          <GradientBox key={i} />
        ))}
      </AllBlogContainer>
      <ViewMoreButton />
    </Box>
  )
}
