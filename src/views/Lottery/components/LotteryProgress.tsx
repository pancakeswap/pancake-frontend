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

const getMinutes = (endTime, currentTime) => ((endTime - currentTime) % 3600) / 60
const getHours = (endTime, currentTime) => ((endTime - currentTime) % (3600 * 24)) / 3600

const getTicketSaleTime = (currentTime): string => {
  const endTime = (parseInt(currentTime / 3600) + 1) * 3600
  const minutes = getMinutes(endTime, currentTime)
  const hours = getHours(endTime, currentTime)
  return `${parseInt(hours)}h, ${parseInt(minutes)}m`
}

const getLotteryDrawTime = (currentTime): string => {
  const endTime = (parseInt(currentTime / 21600) + 1) * 21600 + 7200
  const minutes = getMinutes(endTime, currentTime)
  const hours = getHours(endTime, currentTime)
  return `${parseInt(hours)}h, ${parseInt(minutes)}m`
}

const getLotteryDrawStep = () => {
  const msBetweenLotteries = 21600000
}

const getTicketSaleStep = ''

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(Date.parse(new Date()) / 1000)
  const TranslateString = useI18n()
  const ticketSaleNotYetStarted = useGetLotteryHasDrawn()
  const timeUntilTicketSale = getTicketSaleTime(currentTime)
  const timeUntilLotteryDraw = getLotteryDrawTime(currentTime)

  const tick = () => {
    setCurrentTime(currentTime + 1)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return (
    <ProgressWrapper>
      <Progress step={10} />
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
