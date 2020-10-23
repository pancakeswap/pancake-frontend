// @ts-nocheck
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import useI18n from '../../../hooks/useI18n'
import { currentLotteryState, LotteryStates } from '../../../lottery/types'

interface TimePros {
  state: boolean
}

const Time: React.FC<TimePros> = ({ state }) => {
  const [currentTime, setCurrentTime] = React.useState(
    Date.parse(new Date()) / 1000,
  )
  const TranslateString = useI18n()
  const endTime = (parseInt(currentTime / 3600) + 1) * 3600
  const seconds = (endTime - currentTime) % 60
  const minutes = ((endTime - currentTime) % 3600) / 60
  const hours = ((endTime - currentTime) % (3600 * 24)) / 3600
  const days = (endTime - currentTime) / (3600 * 24)

  const stateDeadlineTime = `${parseInt(hours)}h, ${parseInt(minutes)}m`

  const tick = () => {
    setCurrentTime(currentTime + 1)
  }

  React.useEffect(() => {
    // 执行定时
    let timerID = setInterval(() => tick(), 1000)
    // 卸载组件时进行清理
    return () => clearInterval(timerID)
  })

  return (
    <div style={{ marginBottom: '1em' }}>
      {state === LotteryStates.BUY_TICKETS_OPEN && (
        <div>
          <Title style={{ marginTop: '2em' }}>⏳</Title>
          <Title>
            {TranslateString(434, 'Approx. time left to buy tickets')}
          </Title>
          <Title2>{stateDeadlineTime}</Title2>
        </div>
      )}
      {state === LotteryStates.WINNERS_ANNOUNCED && (
        <div>
          <Title style={{ marginTop: '2em' }}>⏳</Title>
          <Title>
            {TranslateString(999, 'Approx. time before next lottery start')}
          </Title>
          <Title2>{stateDeadlineTime}</Title2>
        </div>
      )}
    </div>
  )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 26px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 36px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

export default Time
