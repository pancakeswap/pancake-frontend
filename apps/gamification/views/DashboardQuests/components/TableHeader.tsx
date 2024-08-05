import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { StyledCell } from 'views/DashboardCampaigns/components/TableStyle'
import { SortBy, Touchable } from 'views/DashboardQuests/components/SortButton'
// import { Box, SortArrowIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
// import { SortButton, SortBy, Touchable, getSortClassName } from 'views/DashboardQuests/components/SortButton'

const StyledRow = styled('div')`
  background-color: transparent;
  display: flex;
  cursor: pointer;

  ${StyledCell} {
    padding: 17px;
    border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

    &:first-child {
      flex: 40%;
      padding-left: 24px;
    }

    &:nth-child(2) {
      flex: 15%;
    }

    &:nth-child(3) {
      flex: 15%;
    }

    &:nth-child(4) {
      flex: 30%;
    }

    &:last-child {
      flex: 0 0 36px;
      padding-right: 24px;
    }
  }
`

export const TableHeader = () => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()

  const [rewardPoolSort, setRewardPoolSort] = useState<SortBy | undefined>()
  const [timelineSort, setTimelineSort] = useState<SortBy | undefined>()

  const onRewardPoolSort = () => {
    setRewardPoolSort(undefined)
    const newSort = !rewardPoolSort ? SortBy.Desc : rewardPoolSort === SortBy.Asc ? SortBy.Desc : SortBy.Asc

    setRewardPoolSort(newSort)
    // onSort?.(SortField.Votes, newSort)
  }

  const onTimelineSort = () => {
    setTimelineSort(undefined)
    const newSort = !timelineSort ? SortBy.Desc : timelineSort === SortBy.Asc ? SortBy.Desc : SortBy.Asc

    setTimelineSort(newSort)
    // onSort?.(SortField.Votes, newSort)
  }

  return (
    <Box>
      <StyledRow role="row">
        <StyledCell role="cell">
          <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
            {t('Quest title and Chain')}
          </Text>
        </StyledCell>
        {isXxl && (
          <>
            <StyledCell role="cell">
              <Touchable onClick={onRewardPoolSort}>
                <Text
                  bold
                  fontSize="12px"
                  textAlign="left"
                  lineHeight="24px"
                  color="secondary"
                  textTransform="uppercase"
                >
                  {t('Total reward')}
                </Text>
                {/* <SortButton scale="sm" variant="subtle" className={getSortClassName(rewardPoolSort)}>
                  <SortArrowIcon />
                </SortButton> */}
              </Touchable>
            </StyledCell>
            <StyledCell role="cell">
              <Text textAlign="right" fontSize="12px" bold textTransform="uppercase" color="secondary">
                {t('Number of Participants')}
              </Text>
            </StyledCell>
          </>
        )}
        <StyledCell role="cell">
          <Touchable onClick={onTimelineSort} ml="auto">
            <Text bold fontSize="12px" textAlign="right" lineHeight="24px" color="secondary" textTransform="uppercase">
              {t('Timeline')}
            </Text>
            {/* <SortButton scale="sm" variant="subtle" className={getSortClassName(timelineSort)}>
              <SortArrowIcon />
            </SortButton> */}
          </Touchable>
        </StyledCell>
        <StyledCell role="cell" />
      </StyledRow>
    </Box>
  )
}
