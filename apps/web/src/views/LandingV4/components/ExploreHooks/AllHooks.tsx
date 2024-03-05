import { useTranslation } from '@pancakeswap/localization'
import {
  AllBlogIcon,
  Box,
  Flex,
  FlexGap,
  OptionProps,
  Select,
  StarFillIcon,
  Tag,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { HookCard } from 'views/LandingV4/components/ExploreHooks/HookCard'
import { GradientBox } from 'views/LandingV4/components/GradientBox'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'
import { HooksConfig } from 'views/LandingV4/config'
import { useSelectorConfig } from 'views/LandingV4/config/filterOptions'
import { HooksType, TagValue } from 'views/LandingV4/config/types'
import { MIN_DISPLAY, useTotalGradientBox } from 'views/LandingV4/hooks/totalGradientBox'

const AllHooksContainer = styled(FlexGap)`
  gap: 24px;
  flex-wrap: wrap;
  margin: 24px 0;

  > div,
  > a {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div,
    > a {
      width: calc(50% - 12px);
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div,
    > a {
      width: calc(33.33% - 16px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div,
    > a {
      width: calc(25% - 18px);
    }
  }
`

const SelectStyled = styled(Select)`
  min-width: 150px;
  height: 36px;

  > div {
    height: 36px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
`

const TagStyled = styled(Tag)<{ $picked: boolean; $hideIconMobileMargin?: boolean }>`
  line-height: 18px;
  height: 36px;
  padding: 0px 16px;
  cursor: pointer;
  border: solid 1px;
  font-weight: 500;
  color: ${({ theme, $picked }) => ($picked ? (theme.isDark ? 'black' : 'white') : theme.colors.text)};
  background-color: ${({ theme, $picked }) =>
    $picked ? theme.colors.textSubtle : theme.isDark ? theme.colors.backgroundAlt : 'white'};
  border-color: ${({ theme, $picked }) => ($picked ? 'transparent' : theme.colors.cardBorder)};

  > svg {
    fill: ${({ theme, $picked }) => ($picked ? (theme.isDark ? 'black' : 'white') : theme.colors.text)};
    margin-left: ${({ $hideIconMobileMargin }) => ($hideIconMobileMargin ? '0' : '0.5em')};
  }
`

export const AllHooks = () => {
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const [pickedOption, setPickedOption] = useState(TagValue.ALL)
  const [pickedByOption, setPickedByOption] = useState(false)

  const [isClickedMoreButton, setIsClickedMoreButton] = useState(false)
  const selectorConfig = useSelectorConfig()

  const showTagAmountNumber = useMemo(() => (isDesktop ? 4 : 0), [isDesktop])

  const outsideTags = useMemo(() => {
    const spliceData = selectorConfig?.slice(0, showTagAmountNumber)
    return spliceData ?? 0
  }, [selectorConfig, showTagAmountNumber])

  const options = useMemo(() => {
    let sliceNumber = pickedByOption ? 1 : showTagAmountNumber
    if (isDesktop) {
      sliceNumber = pickedByOption ? showTagAmountNumber : showTagAmountNumber - 1
    }

    const spliceData = selectorConfig?.slice(sliceNumber, selectorConfig.length)
    return spliceData
  }, [isDesktop, pickedByOption, selectorConfig, showTagAmountNumber])

  const customPlaceHolderText = useMemo(() => {
    const index = options.findIndex((option) => Number(option?.value as TagValue) === pickedOption)
    const total = pickedByOption ? options.length : options.length - 1

    if (pickedByOption && index >= 0) {
      return options[index]?.label
    }

    if (isDesktop) {
      return `+${t('%total% categories', { total })}`
    }

    if (isMobile && index < 0) {
      return t('More')
    }

    return t('%total% categories', { total })
  }, [options, isDesktop, pickedByOption, isMobile, t, pickedOption])

  const onClickTag = (value: TagValue, byOption: boolean) => {
    setPickedOption(value)
    setPickedByOption(byOption)
  }

  const tokenSelectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === pickedOption)
    return index >= 0 ? index + 1 : 0
  }, [options, pickedOption])

  // data
  const allData = useMemo((): HooksType[] => {
    if (pickedOption === TagValue.ALL) {
      return HooksConfig
    }

    return HooksConfig.filter((i) => i.tagsValue.includes(pickedOption))
  }, [pickedOption])

  const filterData = useMemo(
    () => (isClickedMoreButton ? allData : allData.slice(0, MIN_DISPLAY)),
    [allData, isClickedMoreButton],
  )

  // Calculate need how many gradient box
  const totalGradientBox = useTotalGradientBox({ isClickedMoreButton, dataLength: filterData.length })

  return (
    <Box>
      <Flex>
        <Flex>
          <Box ml="8px" onClick={() => onClickTag(TagValue.FEATURED, false)}>
            <TagStyled
              variant="textSubtle"
              $picked={pickedOption === TagValue.FEATURED}
              endIcon={<StarFillIcon width={14} height={14} />}
            >
              {t('Featured')}
            </TagStyled>
          </Box>
          <Box ml="8px" onClick={() => onClickTag(TagValue.ALL, false)}>
            <TagStyled
              variant="textSubtle"
              $picked={pickedOption === TagValue.ALL}
              $hideIconMobileMargin={isMobile}
              endIcon={<AllBlogIcon width={20} height={20} />}
            >
              {isMobile ? null : t('All Hooks')}
            </TagStyled>
          </Box>
        </Flex>
        <Flex ml="auto">
          <Flex>
            {outsideTags?.map((tag) => (
              <Box key={tag.value} mr="8px" onClick={() => onClickTag(tag.value, false)}>
                <TagStyled
                  variant="textSubtle"
                  $picked={tag.value === pickedOption}
                  // endIcon={<HotIcon width={20} height={20} />}
                >
                  {tag.label}
                </TagStyled>
              </Box>
            ))}
          </Flex>
          <SelectStyled
            options={options}
            key={tokenSelectedIndex}
            defaultOptionIndex={tokenSelectedIndex}
            customPlaceHolderText={customPlaceHolderText}
            onOptionChange={(option: OptionProps) => onClickTag(option.value, true)}
          />
        </Flex>
      </Flex>
      <AllHooksContainer>
        {filterData.map((hook) => (
          <HookCard key={hook.githubLink} hook={hook} />
        ))}
        {totalGradientBox?.map((i) => (
          <GradientBox key={i} />
        ))}
      </AllHooksContainer>
      {!isClickedMoreButton && allData.length > MIN_DISPLAY && (
        <Box mb="40px">
          <ViewMoreButton onClick={() => setIsClickedMoreButton(true)} />
        </Box>
      )}
    </Box>
  )
}
