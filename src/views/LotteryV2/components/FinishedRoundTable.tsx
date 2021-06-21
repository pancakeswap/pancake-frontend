import React from 'react'
import styled from 'styled-components'
import { Text, ChevronRightIcon, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetUserLotteryHistory, useLottery } from 'state/hooks'
import HistoryGridRow from './HistoryGridRow'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
`

interface FinishedRoundTableProps {
  handleHistoryRowClick: (string) => void
}

const FinishedRoundTable: React.FC<FinishedRoundTableProps> = ({ handleHistoryRowClick }) => {
  const { t } = useTranslation()
  const userLotteryHistory = useGetUserLotteryHistory()
  const { currentLotteryId } = useLottery()

  const filteredForCurrentRound = userLotteryHistory?.rounds.filter((round) => {
    return round.lotteryId !== currentLotteryId
  })
  const mostRecentRoundsFirst = filteredForCurrentRound?.reverse()

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
          mostRecentRoundsFirst.map((pastRound) => (
            <HistoryGridRow
              key={pastRound.lotteryId}
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

export default FinishedRoundTable
