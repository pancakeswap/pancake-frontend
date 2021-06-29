import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { CardHeader, Card, CardBody, Text, CardFooter, ArrowBackIcon, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { fetchLottery, fetchTickets } from 'state/lottery/helpers'
import { useGetUserLotteriesGraphData, useLottery } from 'state/hooks'
import UnlockButton from 'components/UnlockButton'
import FinishedRoundTable from './FinishedRoundTable'
import { WhiteBunny } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 320px;
  }
`

const StyledCardBody = styled(CardBody)`
  min-height: 240px;
`

const YourHistoryCard = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [viewFinishedRound, setViewFinishedRound] = useState(false)
  const [roundDetails, setRoundDetails] = useState(null)
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const handleHistoryRowClick = async (roundId) => {
    // TODO: Load in necessary lottery data. May not require fetch, as all this data is likely required for this component
    // const lottery = await fetchLottery(roundId)
    // const userTicketIds = await fetchTickets(roundId, account)
    setViewFinishedRound(true)
  }

  const getHeader = () => {
    if (viewFinishedRound) {
      return (
        <Flex alignItems="center">
          <ArrowBackIcon onClick={() => setViewFinishedRound(false)} mr="20px" />
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Heading scale="md">{t('Round')} </Heading>
            <Text>{t('Drawn')}</Text>
          </Flex>
        </Flex>
      )
    }

    return <Heading scale="md">{t('Rounds')}</Heading>
  }

  const getBody = () => {
    const pastUserRounds = userLotteryData?.rounds.filter((round) => {
      return round.lotteryId !== currentLotteryId
    })

    if (!account) {
      return (
        <Flex minHeight="inherit" flexDirection="column" alignItems="center" justifyContent="center">
          <Text maxWidth="180px" textAlign="center" color="textSubtle" mb="16px">
            {t('Connect your wallet to check your history')}
          </Text>
          <UnlockButton />
        </Flex>
      )
    }
    if (pastUserRounds.length === 0) {
      return (
        <Flex minHeight="inherit" flexDirection="column" alignItems="center" justifyContent="center">
          <Flex alignItems="center" justifyContent="center" mb="16px">
            <WhiteBunny height="24px" mr="8px" /> <Text textAlign="left">{t('No lottery history found')}</Text>
          </Flex>
          <Text textAlign="center" color="textSubtle" mb="16px">
            {t('Buy tickets for the next round!')}
          </Text>
          <BuyTicketsButton disabled={ticketBuyIsDisabled} width="100%" />
        </Flex>
      )
    }
    return <FinishedRoundTable handleHistoryRowClick={handleHistoryRowClick} />
  }

  return (
    <StyledCard>
      <CardHeader>{getHeader()}</CardHeader>
      {viewFinishedRound ? (
        <CardBody>
          <div>wat</div>
        </CardBody>
      ) : (
        <>
          <StyledCardBody>{getBody()}</StyledCardBody>
          <CardFooter>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <Text fontSize="12px" color="textSubtle">
                {t('Only showing data for Lottery V2')}
              </Text>
            </Flex>
          </CardFooter>
        </>
      )}
    </StyledCard>
  )
}

export default YourHistoryCard
