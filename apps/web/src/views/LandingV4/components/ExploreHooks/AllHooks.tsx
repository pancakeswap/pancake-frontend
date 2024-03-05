import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, HotIcon, OptionProps, Select, Tag, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { HookCard } from 'views/LandingV4/components/ExploreHooks/HookCard'
import { GradientBox } from 'views/LandingV4/components/GradientBox'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'
import { useTotalGradientBox } from 'views/LandingV4/hooks/totalGradientBox'

const AllHooksContainer = styled(FlexGap)`
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
  min-width: 125px;
  height: 36px;

  > div {
    height: 36px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 147px;
  }
`

const SelectorConfig = [
  {
    label: 'Hi 1',
    value: 2,
  },
  {
    label: 'Hi 2',
    value: 3,
  },
  {
    label: 'Hi 3',
    value: 4,
  },
  {
    label: 'Hi 4',
    value: 5,
  },
  {
    label: 'Hi 5',
    value: 6,
  },
  {
    label: 'Hi 6',
    value: 7,
  },
  {
    label: 'Hi 7',
    value: 8,
  },
  {
    label: 'Hi 8',
    value: 9,
  },
]

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

  const fakeData = [1, 2, 3, 4]
  const [pickedOption, setPickedOption] = useState(0)
  const [isClickedMoreButton, setIsClickedMoreButton] = useState(false)

  const showTagAmountNumber = useMemo(() => (isDesktop ? 4 : 0), [isDesktop])

  const outsideTags = useMemo(() => {
    const spliceData = SelectorConfig?.slice(0, showTagAmountNumber)
    return spliceData ?? 0
  }, [showTagAmountNumber])

  const options = useMemo(() => {
    const spliceData = SelectorConfig?.slice(showTagAmountNumber, SelectorConfig.length)
    return spliceData
  }, [showTagAmountNumber])

  const customPlaceHolderText = useMemo(() => {
    const index = options.findIndex((option) => option.value === pickedOption)

    if (index >= 0) {
      return options[index]?.label
    }

    if (isDesktop) {
      return `+${t('%total% categories', { total: options.length })}`
    }

    if (isMobile && index < 0) {
      return t('More')
    }

    return t('%total% categories', { total: options.length })
  }, [options, isDesktop, isMobile, pickedOption, t])

  // Calculate need how many gradient box
  const totalGradientBox = useTotalGradientBox({ isClickedMoreButton, dataLength: fakeData.length })

  return (
    <Box>
      <Flex>
        <Flex>
          <Box ml="8px" onClick={() => setPickedOption(0)}>
            <TagStyled variant="textSubtle" $picked={pickedOption === 0} endIcon={<HotIcon width={20} height={20} />}>
              {t('Featured')}
            </TagStyled>
          </Box>
          <Box ml="8px" onClick={() => setPickedOption(1)}>
            <TagStyled
              variant="textSubtle"
              $picked={pickedOption === 1}
              $hideIconMobileMargin={isMobile}
              endIcon={<HotIcon width={20} height={20} />}
            >
              {isMobile ? null : t('All Hooks')}
            </TagStyled>
          </Box>
        </Flex>
        <Flex ml="auto">
          <Flex>
            {outsideTags.map((tag) => (
              <Box key={tag.value} mr="8px" onClick={() => setPickedOption(tag.value)}>
                <TagStyled
                  variant="textSubtle"
                  $picked={tag.value === pickedOption}
                  endIcon={<HotIcon width={20} height={20} />}
                >
                  {tag.label}
                </TagStyled>
              </Box>
            ))}
          </Flex>
          <SelectStyled
            options={options}
            customPlaceHolderText={customPlaceHolderText}
            onOptionChange={(option: OptionProps) => setPickedOption(option.value)}
          />
        </Flex>
      </Flex>
      <AllHooksContainer>
        {fakeData.map((i) => (
          <HookCard key={i} />
        ))}
        {totalGradientBox?.map((i) => (
          <GradientBox key={i} />
        ))}
      </AllHooksContainer>
      <Box mb="40px">
        <ViewMoreButton />
      </Box>
    </Box>
  )
}
