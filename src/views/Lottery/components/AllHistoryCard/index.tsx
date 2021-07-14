import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, CardFooter, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/hooks'
import { LotteryStatus } from 'config/constants/types'
import RoundSwitcher from './RoundSwitcher'

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
  const {
    currentLotteryId,
    currentRound: { status, isLoading },
  } = useLottery()
  const timer = useRef(null)
  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const [selectedRound, setSelectedRound] = useState(mostRecentFinishedRoundId.toString())
  const [loadingTimeoutActive, setLoadingTimeoutActive] = useState(false)

  useEffect(() => {
    setLoadingTimeoutActive(true)

    timer.current = setInterval(() => {
      console.log('fetching data')
      setLoadingTimeoutActive(false)
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRound])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRound(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRound('')
      }
      if (parseInt(value, 10) >= mostRecentFinishedRoundId) {
        setSelectedRound(mostRecentFinishedRoundId.toString())
      }
    } else {
      setSelectedRound('')
    }
  }

  const handleArrowButonPress = (targetRound) => {
    setSelectedRound(targetRound)
  }

  return (
    <StyledCard>
      <StyledCardBody>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRound={selectedRound}
          mostRecentRound={mostRecentFinishedRoundId}
          handleInputChange={handleInputChange}
          handleArrowButonPress={handleArrowButonPress}
        />
      </StyledCardBody>
    </StyledCard>
  )
}

export default YourHistoryCard
