import React, { useEffect, useState } from 'react'
import { Box, Text, Flex, Button, Skeleton, Ticket, PresentWonIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { LotteryTicket } from 'config/constants/types'
import { fetchLottery, fetchTickets, processRawTicketsResponse } from 'state/lottery/helpers'
import { fetchUserTicketsForMultipleRounds, getWinningTickets } from 'state/lottery/fetchUnclaimedUserRewards'
import { LotteryRound } from 'state/types'
import { useGetUserLotteryGraphRoundById } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import WinningNumbers from '../WinningNumbers'
import { processLotteryResponse } from '../../helpers'
import TicketNumber from '../TicketNumber'

const ScrollBox = styled(Box)`
  max-height: 300px;
  overflow-y: scroll;
  margin-top: 24px;
`

const TicketSkeleton = () => {
  return (
    <>
      <Skeleton width="32px" height="12px" mt="2px" mb="4px" />
      <Skeleton width="100%" height="34px" mb="12px" />
    </>
  )
}

const HistoricTicketsInner: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [lotteryInfo, setLotteryInfo] = useState<LotteryRound>(null)
  const [allUserTickets, setAllUserTickets] = useState<LotteryTicket[]>(null)
  const [userWinningTickets, setUserWinningTickets] = useState<{
    allWinningTickets: LotteryTicket[]
    ticketsWithUnclaimedRewards: LotteryTicket[]
    isFetched: boolean
  }>({ allWinningTickets: null, ticketsWithUnclaimedRewards: null, isFetched: false })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const userLotteryRoundData = useGetUserLotteryGraphRoundById(roundId)

  useEffect(() => {
    const addWinningTicketInfoToAllTickets = (
      _allTickets: LotteryTicket[],
      _allWinningTickets: LotteryTicket[],
    ): LotteryTicket[] => {
      const allTicketsWithWinningTickets = _allTickets.map((ticket) => {
        const winningTicketEquivalent = _allWinningTickets.find((winningTicket) => winningTicket.id === ticket.id)
        if (winningTicketEquivalent) {
          return winningTicketEquivalent
        }
        return ticket
      })
      return allTicketsWithWinningTickets
    }

    const sortTicketsByWinningBracket = (tickets) => {
      return tickets.sort((ticketA, ticketB) => {
        const rewardBracket1 = ticketA.rewardBracket === undefined ? 0 : ticketA.rewardBracket + 1
        const rewardBracket2 = ticketB.rewardBracket === undefined ? 0 : ticketB.rewardBracket + 1
        return rewardBracket2 - rewardBracket1
      })
    }

    const fetchData = async () => {
      const userTickets = await fetchTickets(account, roundId, userLotteryRoundData)
      const lotteryData = await fetchLottery(roundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      const winningTickets = await getWinningTickets({
        roundId,
        userTickets,
        finalNumber: processedLotteryData.finalNumber.toString(),
      })

      setUserWinningTickets({
        isFetched: true,
        allWinningTickets: winningTickets?.allWinningTickets,
        ticketsWithUnclaimedRewards: winningTickets?.ticketsWithUnclaimedRewards,
      })
      setLotteryInfo(processedLotteryData)

      // If the user has some winning tickets - modify the userTickets response to include that data
      if (winningTickets?.allWinningTickets) {
        const allTicketsWithWinningTicketInfo = addWinningTicketInfoToAllTickets(
          userTickets,
          winningTickets.allWinningTickets,
        )
        const ticketsSortedByWinners = sortTicketsByWinningBracket(allTicketsWithWinningTicketInfo)
        setAllUserTickets(ticketsSortedByWinners)
      } else {
        setAllUserTickets(userTickets)
      }
    }

    fetchData()
  }, [roundId, account, userLotteryRoundData])

  return (
    <>
      <Flex pb="16px" borderBottom={`1px solid ${theme.colors.cardBorder}`} flexDirection="column">
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="4px">
          {t('Winning number')}
        </Text>
        {lotteryInfo?.finalNumber ? (
          <WinningNumbers number={lotteryInfo.finalNumber.toString()} />
        ) : (
          <Skeleton width="230px" height="34px" />
        )}
      </Flex>
      <ScrollBox>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="16px">
          {t('Your tickets')}
        </Text>
        <Flex mb="8px" justifyContent="space-between">
          <Flex>
            <Ticket width="24px" height="24px" mr="8px" />
            <Text bold color="text">
              {t('Total tickets')}:
            </Text>
          </Flex>
          <Text bold color="text">
            {allUserTickets ? allUserTickets.length : <Skeleton width="56px" height="24px" />}
          </Text>
        </Flex>
        <Flex mb="24px" justifyContent="space-between">
          <Flex>
            <PresentWonIcon width="24px" height="24px" mr="8px" />
            <Text bold color="text">
              {t('Winning tickets')}:
            </Text>
          </Flex>
          <Text bold color="text">
            {userWinningTickets.isFetched ? (
              userWinningTickets?.allWinningTickets?.length || '0'
            ) : (
              <Skeleton width="40px" height="24px" />
            )}
          </Text>
        </Flex>
        {allUserTickets ? (
          allUserTickets.map((ticket) => {
            return (
              <TicketNumber
                key={ticket.id}
                id={ticket.id}
                number={ticket.number}
                rewardBracket={ticket.rewardBracket}
              />
            )
          })
        ) : (
          <>
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
          </>
        )}
      </ScrollBox>
      <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} alignItems="center" justifyContent="center">
        <Button mt="24px" width="100%">
          Test
        </Button>
      </Flex>
    </>
  )
}

export default HistoricTicketsInner
