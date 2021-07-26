import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Flex,
  Button,
  Skeleton,
  Ticket,
  PresentWonIcon,
  TooltipText,
  InfoIcon,
  useTooltip,
  useModal,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { fetchLottery } from 'state/lottery/helpers'
import { getWinningTickets } from 'state/lottery/fetchUnclaimedUserRewards'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'
import { LotteryRound } from 'state/types'
import { useGetUserLotteryGraphRoundById } from 'state/lottery/hooks'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import WinningNumbers from '../WinningNumbers'
import { processLotteryResponse } from '../../helpers'
import TicketNumber from '../TicketNumber'
import ClaimPrizesModal from '../ClaimPrizesModal'

const TopBox = styled(Flex)`
  flex-direction: column;
  margin: -24px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const ScrollBox = styled(Box)`
  margin-right: -20px;
  padding-right: 24px;
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

const PreviousRoundTicketsInner: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [lotteryInfo, setLotteryInfo] = useState<LotteryRound>(null)
  const [allUserTickets, setAllUserTickets] = useState<LotteryTicket[]>(null)
  const [userWinningTickets, setUserWinningTickets] = useState<{
    allWinningTickets: LotteryTicket[]
    ticketsWithUnclaimedRewards: LotteryTicket[]
    isFetched: boolean
    claimData: LotteryTicketClaimData
  }>({ allWinningTickets: null, ticketsWithUnclaimedRewards: null, isFetched: false, claimData: null })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { totalTickets } = useGetUserLotteryGraphRoundById(roundId)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={[userWinningTickets.claimData]} />, false)

  const TooltipComponent = () => (
    <>
      <Text mb="16px">
        {t('Tickets must match the winning number in the exact same order, starting from the first digit.')}
      </Text>
      <Text mb="16px">{t('If the winning number is “123456”:')}</Text>
      <Text mb="4px">{t('“120000” matches the first 2 digits.')}</Text>
      <Text>
        {t('“000006” matches the last digit, but since the first five digits are wrong, it doesn’t win any prizes.')}
      </Text>
    </>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

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
      const userTickets = await fetchUserTicketsForOneRound(account, roundId)
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
        claimData: winningTickets,
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
  }, [roundId, account, totalTickets])

  const getFooter = () => {
    if (userWinningTickets?.ticketsWithUnclaimedRewards?.length > 0) {
      return (
        <Button onClick={onPresentClaimModal} mt="24px" width="100%">
          {t('Collect Prizes')}
        </Button>
      )
    }
    if (!userWinningTickets.allWinningTickets) {
      return (
        <div ref={targetRef}>
          <Flex alignItems="center" justifyContent="center" mt="20px">
            <InfoIcon height="20px" width="20px" color="textSubtle" mr="8px" />
            <TooltipText color="textSubtle">{t("Why didn't I win?")}</TooltipText>
          </Flex>
        </div>
      )
    }
    return null
  }

  return (
    <>
      {tooltipVisible && tooltip}
      <TopBox>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="4px">
          {t('Winning number')}
        </Text>
        {lotteryInfo?.finalNumber ? (
          <WinningNumbers number={lotteryInfo.finalNumber.toString()} />
        ) : (
          <Skeleton width="230px" height="34px" />
        )}
      </TopBox>
      <ScrollBox>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" my="16px">
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
                status={ticket.status}
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
        {userWinningTickets.isFetched && getFooter()}
      </Flex>
    </>
  )
}

export default PreviousRoundTicketsInner
