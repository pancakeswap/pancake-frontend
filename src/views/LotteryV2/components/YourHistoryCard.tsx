import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  CardHeader,
  Card,
  CardBody,
  Text,
  CardFooter,
  ArrowBackIcon,
  Flex,
  Heading,
  Skeleton,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryRound } from 'state/types'
import UnlockButton from 'components/UnlockButton'
import FinishedRoundTable from './FinishedRoundTable'
import { WhiteBunny } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'
import LotteryHistoryCardBody from './LotteryHistoryCardBody'
import { dateOptions, dateTimeOptions } from '../helpers'

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
  const [shouldShowRoundDetail, setShouldShowRoundDetail] = useState(false)
  const [selectedLotteryInfo, setSelectedLotteryInfo] = useState<LotteryRound>(null)
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>(null)

  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const handleHistoryRowClick = async (lotteryId: string) => {
    setShouldShowRoundDetail(true)
    setSelectedLotteryId(lotteryId)
    const lotteryData = await fetchLottery(lotteryId)
    setSelectedLotteryInfo(lotteryData)
  }

  const clearState = () => {
    setShouldShowRoundDetail(false)
    setSelectedLotteryInfo(null)
    setSelectedLotteryId(null)
  }

  const getDrawnDate = (endTime: string) => {
    const endTimeInMs = parseInt(endTime, 10) * 1000
    const endTimeAsDate = new Date(endTimeInMs)
    return endTimeAsDate.toLocaleDateString(undefined, dateTimeOptions)
  }

  const getHeader = () => {
    if (shouldShowRoundDetail) {
      return (
        <Flex alignItems="center">
          <ArrowBackIcon cursor="pointer" onClick={() => clearState()} mr="20px" />
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Heading scale="md" mb="4px">
              {t('Round')} {selectedLotteryId || ''}
            </Heading>
            {selectedLotteryInfo?.endTime ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(selectedLotteryInfo.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )}
          </Flex>
        </Flex>
      )
    }

    return <Heading scale="md">{t('Rounds')}</Heading>
  }

  const getBody = () => {
    if (shouldShowRoundDetail) {
      return <LotteryHistoryCardBody lotteryData={selectedLotteryInfo} />
    }

    const pastUserRounds = userLotteryData?.rounds.filter((round) => {
      return round.lotteryId !== currentLotteryId
    })

    if (!account) {
      return (
        <StyledCardBody>
          <Flex minHeight="inherit" flexDirection="column" alignItems="center" justifyContent="center">
            <Text maxWidth="180px" textAlign="center" color="textSubtle" mb="16px">
              {t('Connect your wallet to check your history')}
            </Text>
            <UnlockButton />
          </Flex>
        </StyledCardBody>
      )
    }
    if (pastUserRounds.length === 0) {
      return (
        <StyledCardBody>
          <Flex minHeight="inherit" flexDirection="column" alignItems="center" justifyContent="center">
            <Flex alignItems="center" justifyContent="center" mb="16px">
              <WhiteBunny height="24px" mr="8px" /> <Text textAlign="left">{t('No lottery history found')}</Text>
            </Flex>
            <Text textAlign="center" color="textSubtle" mb="16px">
              {t('Buy tickets for the next round!')}
            </Text>
            <BuyTicketsButton disabled={ticketBuyIsDisabled} width="100%" />
          </Flex>
        </StyledCardBody>
      )
    }
    return <FinishedRoundTable handleHistoryRowClick={handleHistoryRowClick} />
  }

  return (
    <StyledCard>
      <CardHeader>{getHeader()}</CardHeader>
      {getBody()}
      <CardFooter>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="12px" color="textSubtle">
            {t('Only showing data for Lottery V2')}
          </Text>
        </Flex>
      </CardFooter>
    </StyledCard>
  )
}

export default YourHistoryCard
