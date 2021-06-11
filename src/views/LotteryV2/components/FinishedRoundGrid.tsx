import React from 'react'
import styled from 'styled-components'
import { Text, ChevronRightIcon, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetUserLotteryHistory } from 'state/hooks'
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
  const userLotteryHistory = useGetUserLotteryHistory()
  // TODO: Reverse rounds. Filter out current round

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
        {/* TODO: Get endTime & claimed data */}
        {userLotteryHistory &&
          userLotteryHistory.pastRounds.map((pastRound) => (
            <HistoryGridRow
              roundId={pastRound.lotteryId}
              hasWon={pastRound.claimed}
              hasClaimed={pastRound.claimed}
              numberTickets={pastRound.totalTickets}
              endTime="1623252324"
              onClick={handleHistoryRowClick}
            />
          ))}
      </Flex>
    </>
  )
}

export default FinishedRoundGrid
