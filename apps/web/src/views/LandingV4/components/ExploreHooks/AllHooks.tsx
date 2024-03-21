import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, MultiSelector, StarFillIcon, Tag, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { HookCard } from 'views/LandingV4/components/ExploreHooks/HookCard'
import { GradientBox } from 'views/LandingV4/components/GradientBox'
import { AllBlogIcon } from 'views/LandingV4/components/Icons/AllBlogIcon'
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

const MultiSelectorStyled = styled(MultiSelector)<{ $hasOptionsPicked: boolean }>`
  height: 36px !important;
  min-width: 150px;
  max-width: 180px;

  > div {
    height: 36px;
    background-color: ${({ theme, $hasOptionsPicked }) =>
      $hasOptionsPicked ? theme.colors.primary : theme.colors.backgroundAlt};
    border-color: ${({ theme, $hasOptionsPicked }) =>
      $hasOptionsPicked ? 'transparent' : theme.colors.cardBorder} !important;

    > div {
      color: ${({ theme, $hasOptionsPicked }) => ($hasOptionsPicked ? theme.colors.white : theme.colors.text)};
    }
  }

  > div:nth-child(2) {
    border-color: ${({ theme }) => theme.colors.cardBorder};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};

    input {
      &:checked {
        border: 0;
        background-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  svg {
    fill: ${({ theme, $hasOptionsPicked }) => ($hasOptionsPicked ? theme.colors.white : theme.colors.text)};
  }
`

const TagStyled = styled(Tag)<{ $picked: boolean; $hideIconMobileMargin?: boolean }>`
  line-height: 18px;
  height: 36px;
  padding: 0px 16px;
  cursor: pointer;
  border: solid 1px;
  font-weight: 500;
  color: ${({ theme, $picked }) => ($picked ? 'white' : theme.colors.text)};
  background-color: ${({ theme, $picked }) => ($picked ? theme.colors.primary : theme.colors.backgroundAlt)};
  border-color: ${({ theme, $picked }) => ($picked ? 'transparent' : theme.colors.cardBorder)};

  > svg {
    width: 20px;
    height: 20px;
    fill: ${({ theme, $picked }) => ($picked ? 'white' : theme.colors.text)};

    ${({ $hideIconMobileMargin }) => $hideIconMobileMargin && 'margin-right: 0;'};
  }
`

export const AllHooks = () => {
  const { t } = useTranslation()
  const { isXxl, isXl, isMobile } = useMatchBreakpoints()
  const [pickedOption, setPickedOption] = useState<TagValue.FEATURED | TagValue.ALL>(TagValue.ALL)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<number>>([])

  const [isClickedMoreButton, setIsClickedMoreButton] = useState(false)
  const selectorConfig = useSelectorConfig()

  const showTagAmountNumber = useMemo(() => (isXxl ? 3 : isXl ? 2 : 0), [isXxl, isXl])

  const outsideTags = useMemo(() => {
    const spliceData = selectorConfig?.slice(0, showTagAmountNumber)
    return spliceData ?? []
  }, [selectorConfig, showTagAmountNumber])

  const options = useMemo(() => {
    const spliceData = selectorConfig?.slice(showTagAmountNumber, selectorConfig.length)
    return spliceData
  }, [showTagAmountNumber, selectorConfig])

  const customPlaceHolderText = useMemo(() => {
    if (isMobile && pickMultiSelect.length === 0) {
      return t('More')
    }

    return t('+%total% categories', { total: options.length })
  }, [isMobile, options.length, pickMultiSelect.length, t])

  const onClickTag = (id: number) => {
    const hasPickedData = pickMultiSelect.includes(id)
    if (hasPickedData) {
      const newData = pickMultiSelect.filter((i) => i !== id)
      setPickMultiSelect(newData)
    } else {
      const newData = [...pickMultiSelect, id]
      setPickMultiSelect(newData)
    }
  }

  // data
  const allData = useMemo((): HooksType[] => {
    // const pickedOptionData = pickedOption === TagValue.ALL ? HooksConfig : HooksConfig.filter((i) => i.featured) // TODO: In future we need add "featured" in config file.
    const pickedOptionData = HooksConfig

    const pickedTagData = pickedOptionData.filter((i) => {
      const hasTag = i.tagsValue.filter((j) => pickMultiSelect.includes(j))
      if (hasTag.length > 0) {
        return i
      }
      return null
    })

    return pickMultiSelect.length > 0 ? pickedTagData : pickedOptionData
  }, [pickMultiSelect])

  const filterData = useMemo(
    () => (isClickedMoreButton ? allData : allData.slice(0, MIN_DISPLAY)),
    [allData, isClickedMoreButton],
  )

  // Calculate need how many gradient box
  const totalGradientBox = useTotalGradientBox({ isClickedMoreButton, dataLength: filterData.length })

  const hasOptionsPicked = useMemo(() => {
    if (pickMultiSelect.length > 0) {
      const hasIndex = options.filter((i) => pickMultiSelect.includes(i.id))
      return hasIndex.length > 0
    }

    return false
  }, [options, pickMultiSelect])

  return (
    <Box>
      <Flex flexDirection={['column', 'row']}>
        <Flex>
          <Box onClick={() => setPickedOption(TagValue.FEATURED)}>
            <TagStyled
              $picked={pickedOption === TagValue.FEATURED}
              startIcon={<StarFillIcon style={{ width: '18px' }} width={18} height={18} />}
            >
              {t('Featured')}
            </TagStyled>
          </Box>
          <Box ml="8px" onClick={() => setPickedOption(TagValue.ALL)}>
            <TagStyled
              $picked={pickedOption === TagValue.ALL}
              $hideIconMobileMargin={isMobile}
              startIcon={<AllBlogIcon width={16} height={16} />}
            >
              {isMobile ? null : t('All Hooks')}
            </TagStyled>
          </Box>
        </Flex>
        <Flex m={['10px 0 0 0', 'auto 0 auto auto']}>
          <Flex>
            {outsideTags?.map((tag) => {
              const icon = selectorConfig.find((i) => i.value === tag.value)?.icon ?? null
              return (
                <Box key={tag.value} mr="8px" onClick={() => onClickTag(tag.value)}>
                  <TagStyled $picked={pickMultiSelect.includes(tag.id)} startIcon={icon}>
                    {tag.label}
                  </TagStyled>
                </Box>
              )
            })}
          </Flex>
          <MultiSelectorStyled
            options={options}
            placeHolderText={customPlaceHolderText}
            $hasOptionsPicked={hasOptionsPicked}
            pickMultiSelect={pickMultiSelect}
            closeDropdownWhenClickOption={false}
            onOptionChange={setPickMultiSelect}
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
