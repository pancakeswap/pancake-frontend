// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import useI18n from '../../../hooks/useI18n'
import { LotteryStates } from '../../../lottery/types'

interface TimePros {
  state: boolean
}

const getDeadlineTime = (state, currentTime): string => {
  if (state === LotteryStates.BUY_TICKETS_OPEN) {
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

const Time: React.FC<TimePros> = ({ state }) => {
  const [currentTime, setCurrentTime] = React.useState(Date.parse(new Date()) / 1000)
  const TranslateString = useI18n()

  const stateDeadlineTime = getDeadlineTime(state, currentTime)

  const tick = () => {
    setCurrentTime(currentTime + 1)
  }

  React.useEffect(() => {
    let timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return (
    <div style={{ marginBottom: '1em' }}>
      {state === LotteryStates.BUY_TICKETS_OPEN && (
        <div>
          <Title style={{ marginTop: '2em' }}>⏳</Title>
          <Title>{TranslateString(434, 'Approx. time until lottery draw')}</Title>
          <Title2>{stateDeadlineTime}</Title2>
        </div>
      )}
      {state === LotteryStates.WINNERS_ANNOUNCED && (
        <div>
          <Title style={{ marginTop: '2em' }}>⏳</Title>
          <Title>{TranslateString(999, 'Approx. time before next lottery start')}</Title>
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
