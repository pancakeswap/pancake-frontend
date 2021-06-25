import React from 'react'
import styled from 'styled-components'
import { Text, Flex, ChevronRightIcon, Box, BlockIcon, PrizeIcon, NotificationDot } from '@pancakeswap/uikit'
import { dateOptions, timeOptions } from '../helpers'

interface HistoryGridRowProps {
  roundId: string
  numberTickets: string
  endTime: string
  onClick: (string) => void
  hasWon?: boolean
}

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  row-gap: 8px;
`

const HistoryGridRow: React.FC<HistoryGridRowProps> = ({
  roundId,
  numberTickets,
  endTime,
  onClick,
  hasWon = false,
}) => {
  const endTimeInMs = parseInt(endTime, 10) * 1000
  const endTimeAsDate = new Date(endTimeInMs)

  return (
    <Grid onClick={() => onClick(roundId)}>
      <Flex alignItems="center">
        <Text fontSize="16px" color="textSubtle">
          {roundId}
        </Text>
      </Flex>
      <Flex justifyContent="center" flexDirection="column">
        <Text fontSize="12px">{endTimeAsDate.toLocaleDateString(undefined, dateOptions)}</Text>
        <Text fontSize="12px" color="textSubtle">
          {endTimeAsDate.toLocaleTimeString(undefined, timeOptions)}
        </Text>
      </Flex>
      <Flex mx="12px" alignItems="center" justifyContent="space-between">
        <Text>{numberTickets}</Text>
        {hasWon ? <PrizeIcon color="warning" /> : <BlockIcon color="disabled" />}
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <ChevronRightIcon color="primary" />
      </Flex>
    </Grid>
  )
}

export default HistoryGridRow
