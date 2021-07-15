import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import RoundSwitcher from './RoundSwitcher'
import { getDrawnDate, processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const YourHistoryCard = () => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status, isLoading },
  } = useLottery()
  const timer = useRef(null)
  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const [selectedRoundId, setSelectedRoundId] = useState(mostRecentFinishedRoundId.toString())
  const [selectedLotteryInfo, setSelectedLotteryInfo] = useState(null)

  useEffect(() => {
    setSelectedLotteryInfo(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryInfo(processedLotteryData)
    }

    timer.current = setInterval(() => {
      fetchLotteryData()
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= mostRecentFinishedRoundId) {
        setSelectedRoundId(mostRecentFinishedRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButonPress = (targetRound) => {
    setSelectedRoundId(targetRound.toString())
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          mostRecentRound={mostRecentFinishedRoundId}
          handleInputChange={handleInputChange}
          handleArrowButonPress={handleArrowButonPress}
        />
        <Box mt="8px">
          {selectedLotteryInfo?.endTime ? (
            <Text fontSize="14px">
              {t('Drawn')} {getDrawnDate(selectedLotteryInfo.endTime)}
            </Text>
          ) : (
            <Skeleton width="185px" height="21px" />
          )}
        </Box>
      </StyledCardHeader>
      {/* <>
        {selectedLotteryInfo && !loadingTimeoutActive ? ( */}
      <PreviousRoundCardBody lotteryData={selectedLotteryInfo} lotteryId={selectedRoundId} />
      {/* ) : (
          <Flex p="40px" alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        )}
      </> */}
      {selectedLotteryInfo && <PreviousRoundCardFooter lotteryData={selectedLotteryInfo} lotteryId={selectedRoundId} />}
    </StyledCard>
  )
}

export default YourHistoryCard
