import { useDelayedUnmount } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  BarChartIcon,
  Box,
  Card,
  ChevronDownIcon,
  Flex,
  Link,
  LogoRoundIcon,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { TableHeader } from 'views/DashboardCampaigns/components/TableHeader'
import { StyledCell } from 'views/DashboardCampaigns/components/TableStyle'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;

  ${StyledCell} {
    &:first-child {
      flex: 40%;
      padding-left: 24px;
    }

    &:nth-child(2) {
      flex: 20%;
    }

    &:nth-child(3) {
      flex: 10%;
    }

    &:nth-child(4) {
      flex: 30%;
    }

    &:last-child {
      flex: 0 0 80px;
      padding-right: 24px;
    }
  }
`

const ArrowIcon = styled((props: any) => <ChevronDownIcon {...props} />)<{ $toggled?: boolean }>`
  transform: ${({ $toggled }) => ($toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

export const Record = () => {
  const { t } = useTranslation()
  const { isXxl, isXl, isDesktop, isTablet } = useMatchBreakpoints()

  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

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

  return (
    <Box
      m="auto"
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      padding={['24px', '24px', '24px', '24px', '40px 24px 0 24px', '40px 24px 0 24px', '40px 0 0 0']}
    >
      <Card style={{ width: '100%' }}>
        <TableHeader />
        <Box>
          <StyledRow role="row" onClick={toggleExpanded}>
            <StyledCell role="cell">
              <Flex>
                <ArrowIcon width="20px" height="20px" mr="6px" color="primary" $toggled={expanded} />
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
              </Flex>
            </StyledCell>
            <StyledCell role="cell">
              <Flex>
                <LogoRoundIcon width="20px" />
                <Text ml="8px">400 CAKE</Text>
              </Flex>
            </StyledCell>
            <StyledCell role="cell">
              <Text ml="auto">2400</Text>
            </StyledCell>
            <StyledCell role="cell">
              <Text ml="auto">12/12/2024 03:30 - 12/12/2024 03:30</Text>
            </StyledCell>
            <StyledCell role="cell">
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
            </StyledCell>
          </StyledRow>
          {shouldRenderActionPanel && <>Expand Info</>}
        </Box>
      </Card>
    </Box>
  )
}
