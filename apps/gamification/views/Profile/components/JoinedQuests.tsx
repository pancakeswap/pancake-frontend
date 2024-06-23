import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonMenu, ButtonMenuItem, Flex, FlexGap } from '@pancakeswap/uikit'
import { MultiSelectorUI, options } from 'components/MultiSelectorUI'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { Quest } from 'views/Quests/components/Quest'
// import { publicConvertIndexToStatus } from 'views/Quests/utils/publicConvertIndexToStatus'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > div {
    width: 100%;
    margin: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 8px);
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > div {
      width: calc(33.33% - 11px);
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      width: calc(25% - 12px);
    }
  }
`

export const JoinedQuests = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(0)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<number>>([])

  const chainsValuePicked = useMemo(() => {
    return pickMultiSelect
      .map((id) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const option = options.find((option) => option.id === id)
        return option ? option.value : null
      })
      .filter((value): value is number => value !== null)
  }, [pickMultiSelect])

  const onStatusButtonChange = (newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }

  // publicConvertIndexToStatus(statusButtonIndex)

  return (
    <Box
      maxWidth={['1200px']}
      m={[
        '16px auto auto auto',
        '16px auto auto auto',
        '24px auto auto auto',
        '24px auto auto auto',
        '40px auto auto auto',
      ]}
      padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
    >
      <Flex width="100%" flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection={['column', 'column', 'row']} mb={['16px', '16px', '24px']}>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            m={['16px 0 0 0', '16px 0 0 0', '0']}
            activeIndex={statusButtonIndex}
            onItemClick={onStatusButtonChange}
          >
            <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
        <MultiSelectorUI
          maxWidth={['100%', '100%', '160px']}
          margin={['0 0 16px 0', '0 0 16px 0', '0 0 0 auto']}
          pickMultiSelect={pickMultiSelect}
          setPickMultiSelect={setPickMultiSelect}
        />
      </Flex>

      <StyledFlexGap>
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
      </StyledFlexGap>
    </Box>
  )
}
