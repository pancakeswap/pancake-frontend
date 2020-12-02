// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'

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

const LotteryCountdown: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(Date.parse(new Date()) / 1000)
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const stateDeadlineTime = getDeadlineTime(lotteryHasDrawn, currentTime)

  const tick = () => {
    setCurrentTime(currentTime + 1)
  }

  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return (
    <div style={{ marginBottom: '1em' }}>
      <div>
        <Title style={{ marginTop: '2em' }}>⏳</Title>
        <Title>
          {lotteryHasDrawn
            ? TranslateString(492, 'Approx. time before next lottery start')
            : TranslateString(434, 'Approx. time until lottery draw')}
        </Title>
        <Title2>{stateDeadlineTime}</Title2>
      </div>
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

export default LotteryCountdown
