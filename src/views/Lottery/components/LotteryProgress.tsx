// @ts-nocheck
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Progress } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'

const ProgressWrapper = styled.div`
  display: block;
  width: 100%;
`

const TopTextWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const BottomTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const StyledPrimaryText = styled(Text)`
  margin-right: 16px;
`

const getMinutes = (msTimeValue) => Math.floor((msTimeValue % 3600000) / 60000)
const getHours = (msTimeValue) => Math.floor((msTimeValue % (3600000 * 24)) / 3600000)
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`

const getTicketSaleTime = (currentTime): string => {
  const endTime = currentTime / 3600 + 1 * 3600
  const timeDifference = endTime - currentTime
  const minutes = getMinutes(timeDifference)
  const hours = getHours(timeDifference)
  return hoursAndMinutesString(hours, minutes)
}

const getLotteryDrawTime = (currentTime): string => {
  // lottery is every 6 hrs (21600000 ms)
  // so they are at 00:00, 06:00, 12:00, 18:00
  // break the current time into chunks of 6hrs (/ 21600000), add one more 6hr unit, multiply by 6hrs to get it back to current timex
  const nextLotteryDraw = (parseInt(currentTime / 21600000) + 1) * 21600000
  const timeUntilLotteryDraw = nextLotteryDraw - currentTime
  const minutes = getMinutes(timeUntilLotteryDraw)
  const hours = getHours(timeUntilLotteryDraw)
  return hoursAndMinutesString(hours, minutes)
}

const getTicketSaleStep = () => ''

const getLotteryDrawStep = (currentTime) => {
  const msBetweenLotteries = 21600000
  const endTime = currentTime / 21600 + 1 * 21600 + 7200
  const msUntilLotteryDraw = (endTime - currentTime) * 1000
  return (msUntilLotteryDraw / msBetweenLotteries) * 100
}

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const TranslateString = useI18n()
  const ticketSaleNotYetStarted = useGetLotteryHasDrawn()
  const timeUntilTicketSale = getTicketSaleTime(currentTime)
  const timeUntilLotteryDraw = getLotteryDrawTime(currentTime)

  const tick = () => {
    setCurrentTime(currentTime + 1000)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return (
    <ProgressWrapper>
      <Progress step={getLotteryDrawStep(currentTime)} />
      <TopTextWrapper>
        <StyledPrimaryText fontSize="20px" bold>
          {ticketSaleNotYetStarted ? timeUntilTicketSale : timeUntilLotteryDraw}
        </StyledPrimaryText>
        <Text fontSize="20px" bold color="contrast">
          {ticketSaleNotYetStarted ? TranslateString(0, 'Until ticket sale') : TranslateString(0, 'Until lottery draw')}
        </Text>
      </TopTextWrapper>
      {ticketSaleNotYetStarted ? (
        <BottomTextWrapper>
          <Text>
            {timeUntilLotteryDraw} {TranslateString(0, 'Until lottery draw')}
          </Text>
        </BottomTextWrapper>
      ) : null}
    </ProgressWrapper>
  )
}

export default Hero
