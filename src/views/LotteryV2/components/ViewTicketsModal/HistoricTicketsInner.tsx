import React, { useEffect, useState } from 'react'
import { Box, Text, Flex, Button, Skeleton } from '@pancakeswap/uikit'
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

const ScrollBox = styled(Box)`
  /* max-height: 300px; */
  overflow-y: scroll;
  margin-top: 24px;
`

const HistoricTicketsInner: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [lotteryInfo, setLotteryInfo] = useState<LotteryRound>(null)
  const [allUserTickets, setAllUserTickets] = useState<LotteryTicket[]>(null)
  const [userWinningTickets, setUserWinningTickets] =
    useState<{ allWinningTickets: LotteryTicket[]; ticketsWithUnclaimedRewards: LotteryTicket[] }>(null)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const userLotteryRoundData = useGetUserLotteryGraphRoundById(roundId)

  useEffect(() => {
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
        allWinningTickets: winningTickets?.allWinningTickets,
        ticketsWithUnclaimedRewards: winningTickets?.ticketsWithUnclaimedRewards,
      })
      setLotteryInfo(processedLotteryData)
      setAllUserTickets(userTickets)
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
          <Text bold color="text">
            {t('Total tickets')}
          </Text>
          <Text bold color="text">
            {allUserTickets && allUserTickets.length}
          </Text>
        </Flex>
        <Flex mb="8px" justifyContent="space-between">
          <Text bold color="text">
            {t('Winning tickets')}
          </Text>
          <Text bold color="text">
            {userWinningTickets && userWinningTickets?.allWinningTickets?.length}
          </Text>
        </Flex>
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
