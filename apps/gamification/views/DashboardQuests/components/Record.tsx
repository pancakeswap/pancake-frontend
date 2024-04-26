import { useTranslation } from '@pancakeswap/localization'
import {
  BarChartIcon,
  Box,
  Card,
  Flex,
  Link,
  LogoRoundIcon,
  OpenNewIcon,
  SortArrowIcon,
  Table,
  Td,
  Text,
  Th,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { SortButton, SortBy, Touchable, getSortClassName } from 'views/DashboardQuests/components/SortButton'

export const Record = () => {
  const { t } = useTranslation()
  const { isXxl, isXl, isDesktop, isTablet } = useMatchBreakpoints()
  const [rewardPoolSort, setRewardPoolSort] = useState<SortBy | undefined>()
  const [timelineSort, setTimelineSort] = useState<SortBy | undefined>()

  const colSpanNumber = useMemo(() => {
    if (isXxl) {
      return 5
    }

    if (isTablet || isXl) {
      return 3
    }

    return 2
  }, [isTablet, isXl, isXxl])

  const {
    targetRef: targetRefStatistics,
    tooltip: tooltipStatistics,
    tooltipVisible: tooltipVisibleStatistics,
  } = useTooltip(t('Statistics'), { placement: 'top' })

  const {
    targetRef: targetRefReview,
    tooltip: tooltipReview,
    tooltipVisible: tooltipVisibleReview,
  } = useTooltip(t('Review'), { placement: 'top' })

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
    <Box
      m="auto"
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      padding={['24px', '24px', '24px', '24px', '40px 24px 0 24px', '40px 24px 0 24px', '40px 0 0 0']}
    >
      <Card style={{ width: '100%' }}>
        <Table width="100%">
          {(isTablet || isDesktop) && (
            <thead>
              <tr>
                <Th width="40%">
                  <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                    {t('quest title')}
                  </Text>
                </Th>
                {isXxl && (
                  <>
                    <Th>
                      <Touchable onClick={onRewardPoolSort}>
                        <Text
                          bold
                          fontSize="12px"
                          textAlign="left"
                          lineHeight="24px"
                          color="secondary"
                          textTransform="uppercase"
                        >
                          {t('total reward pool')}
                        </Text>
                        <SortButton scale="sm" variant="subtle" className={getSortClassName(rewardPoolSort)}>
                          <SortArrowIcon />
                        </SortButton>
                      </Touchable>
                    </Th>
                    <Th>
                      <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="right">
                        {t('questers')}
                      </Text>
                    </Th>
                  </>
                )}
                <Th>
                  <Touchable onClick={onTimelineSort}>
                    <Text
                      bold
                      ml="auto"
                      fontSize="12px"
                      textAlign="right"
                      lineHeight="24px"
                      color="secondary"
                      textTransform="uppercase"
                    >
                      {t('Timeline')}
                    </Text>
                    <SortButton scale="sm" variant="subtle" className={getSortClassName(timelineSort)}>
                      <SortArrowIcon />
                    </SortButton>
                  </Touchable>
                </Th>
                <Th />
              </tr>
            </thead>
          )}
          <tbody>
            {/* <tr>
              <Td colSpan={colSpanNumber} textAlign="center">
                {t('Loading...')}
              </Td>
            </tr>
            <tr>
              <Td colSpan={colSpanNumber} textAlign="center">
                {t('No results')}
              </Td>
            </tr> */}
            <>
              <tr>
                <Td>
                  <Text
                    bold
                    overflow="hidden"
                    display="-webkit-box"
                    style={{
                      whiteSpace: 'initial',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    PancakeSwap Multichain Celebration - zkSync Era 123 123123 12312
                  </Text>
                </Td>
                {isXxl && (
                  <>
                    <Td>
                      <Flex>
                        <LogoRoundIcon width="20px" />
                        <Text ml="8px">400 CAKE</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Text textAlign="right">2400</Text>
                    </Td>
                  </>
                )}
                {(isTablet || isDesktop) && (
                  <Td>
                    <Text textAlign="right">12/12/2024 03:30 - 12/12/2024 03:30</Text>
                  </Td>
                )}
                <Td>
                  <Flex>
                    <Box ref={targetRefStatistics}>
                      <Link href="/">
                        <BarChartIcon color="primary" width="20px" height="20px" />
                      </Link>
                      {tooltipVisibleStatistics && tooltipStatistics}
                    </Box>
                    <Box ref={targetRefReview}>
                      <Link ml="8px" href="/">
                        <OpenNewIcon color="primary" width="20px" height="20px" />
                      </Link>
                      {tooltipVisibleReview && tooltipReview}
                    </Box>
                  </Flex>
                </Td>
              </tr>
            </>
          </tbody>
        </Table>
      </Card>
    </Box>
  )
}
