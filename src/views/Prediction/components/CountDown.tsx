import React from 'react'
import { Text, TextProps } from '@pancakeswap-libs/uikit'
import { useTimer } from 'hooks/useTimer'
import getTimePeriods from 'utils/getTimePeriods'

interface CountDownProps extends TextProps {
  seconds: number
  timeOver?: () => void
  style?: React.CSSProperties
}

const formatTime = (s: number) => {
  const { hours, minutes, seconds } = getTimePeriods(s)
  return {
    h: `${hours}`.padStart(2, '0'),
    m: `${minutes}`.padStart(2, '0'),
    s: `${seconds}`.padStart(2, '0'),
  }
}

const CountDown: React.FC<CountDownProps> = ({ seconds, timeOver, ...restProps }) => {
  const realSeconds = seconds > 0 ? seconds : 0
  const remain = useTimer(realSeconds)
  if (remain === 0 && typeof timeOver === 'function') timeOver()
  const { h, m, s } = formatTime(remain)

  return (
    <Text bold color="success" {...restProps}>
      {h}:{m}:{s}
    </Text>
  )
}

export default React.memo(CountDown)
