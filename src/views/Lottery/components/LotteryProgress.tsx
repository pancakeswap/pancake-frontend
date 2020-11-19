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

const StyledText = styled(Text)`
  margin-right: 16px;
`

const getDeadlineTime = (lotteryHasDrawn, currentTime): string => {
  if (!lotteryHasDrawn) {
    const endTime = (parseInt(currentTime / 21600) + 1) * 21600 + 7200
    const minutes = ((endTime - currentTime) % 3600) / 60
    const hours = (((endTime - currentTime) % (3600 * 24)) / 3600) % 6
    return `${parseInt(hours)}h, ${parseInt(minutes)}m`
  }
  const endTime = (parseInt(currentTime / 3600) + 1) * 3600
  const minutes = ((endTime - currentTime) % 3600) / 60
  const hours = ((endTime - currentTime) % (3600 * 24)) / 3600
  return `${parseInt(hours)}h, ${parseInt(minutes)}m`
}

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(Date.parse(new Date()) / 1000)
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const timeUntilTicketSale = ''
  const timeUntilLotteryDraw = getDeadlineTime(lotteryHasDrawn, currentTime)

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
        {lotteryHasDrawn ? (
          <>
            <StyledText fontSize="20px" bold>
              1h 30m
            </StyledText>
            <Text fontSize="20px" bold color="contrast">
              Until ticket sale
            </Text>
          </>
        ) : null}
      </TopTextWrapper>
      <BottomTextWrapper>
        <Text>
          {timeUntilLotteryDraw} {TranslateString(0, 'until lottery draw')}
        </Text>
      </BottomTextWrapper>
    </ProgressWrapper>
  )
}

export default Hero
