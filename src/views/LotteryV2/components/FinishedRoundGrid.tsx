import React from 'react'
import styled from 'styled-components'
import { Text, ChevronRightIcon, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import HistoryGridRow from './HistoryGridRow'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
`

interface FinishedRoundGridProps {
  handleHistoryRowClick: (string) => void
}

const FinishedRoundGrid: React.FC<FinishedRoundGridProps> = ({ handleHistoryRowClick }) => {
  const { t } = useTranslation()

  return (
    <>
      <Grid mb="8px">
        <Text bold fontSize="12px" color="secondary">
          #
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Date')}
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Your Tickets')}
        </Text>
        <Flex>
          <ChevronRightIcon color="background" />
        </Flex>
      </Grid>
      <Flex flexDirection="column">
        {/* TODO: Populate with data */}
        <HistoryGridRow roundId="4" numberTickets="12" endTime="1623252324" onClick={handleHistoryRowClick} />
        <HistoryGridRow roundId="3" numberTickets="110" endTime="1623152325" hasWon onClick={handleHistoryRowClick} />
        <HistoryGridRow
          roundId="2"
          numberTickets="5"
          endTime="1623052326"
          hasWon
          hasClaimed
          onClick={handleHistoryRowClick}
        />
      </Flex>
    </>
  )
}

export default FinishedRoundGrid
