import { Box, ButtonMenu, ButtonMenuItem, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import React, { useState } from 'react'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'

const PriceChart = ({ lineChartData = [], setTimeWindowIndex, timeWindowIndex }) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const currentDate = format(new Date(), 'MMM d, yyyy')
  const valueToDisplay = formatAmount(hoverValue)

  return (
    <>
      <Box>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column" px="24px" pt="24px">
            {valueToDisplay ? (
              <Text fontSize="24px" bold>
                ${valueToDisplay}
              </Text>
            ) : (
              <Skeleton height="36px" width="128px" />
            )}
            <Text small color="secondary">
              {hoverDate || currentDate}
            </Text>
          </Flex>
          <Box mr="40px">
            <ButtonMenu activeIndex={timeWindowIndex} onItemClick={setTimeWindowIndex} scale="sm">
              <ButtonMenuItem>24H</ButtonMenuItem>
              <ButtonMenuItem>1W</ButtonMenuItem>
              <ButtonMenuItem>1M</ButtonMenuItem>
              <ButtonMenuItem>1Y</ButtonMenuItem>
            </ButtonMenu>
          </Box>
        </Flex>
        <Box px="24px" height="335px" minWidth="752px">
          <LineChart data={lineChartData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
        </Box>
      </Box>
    </>
  )
}

export default PriceChart
