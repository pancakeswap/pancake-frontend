import React from 'react'
import { Flex, Heading } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from './Timer'

interface CountdownProps {
  secondsRemaining: number
  preCountdownText?: string
  postCountdownText?: string
}

const Countdown: React.FC<CountdownProps> = ({ secondsRemaining, preCountdownText, postCountdownText }) => {
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <Flex display="inline-flex" justifyContent="flex-end" alignItems="flex-end" borderBottom="1px dotted white">
      {preCountdownText && (
        <Heading mr="12px" color="#ffff">
          {preCountdownText}
        </Heading>
      )}
      <Timer
        minutes={minutes + 1} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
        hours={hours}
        days={days}
      />
      {postCountdownText && <Heading color="#ffff">{postCountdownText}</Heading>}
    </Flex>
  )
}

export default Countdown
