import React, { useEffect } from 'react'
import { Text, TextProps } from '@pancakeswap-libs/uikit'
import { useTimer } from 'hooks/useTimer'

interface CountDownProps extends TextProps {
  seconds: number
  timeOver?: () => void
  style?: Record<string, string>
}

const formatTime = (seconds: number) => {
  let l = seconds % 86400
  const h = Math.floor(l / 3600)
  l %= 3600
  const m = Math.floor(l / 60)
  l %= 60
  return {
    h: `${h}`.padStart(2, '0'),
    m: `${m}`.padStart(2, '0'),
    s: `${l}`.padStart(2, '0'),
  }
}

const CountDown: React.FC<CountDownProps> = ({ seconds, timeOver, ...restProps }) => {
  const _seconds = seconds > 0 ? seconds : 0
  const remine = useTimer(_seconds)
  if (remine === 0 && typeof timeOver === 'function') timeOver()
  const { h, m, s } = formatTime(remine)

  return (
    <Text bold color="success" {...restProps}>
      {h}:{m}:{s}
    </Text>
  )
}

export default React.memo(CountDown)
