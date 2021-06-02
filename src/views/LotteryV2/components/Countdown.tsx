import React from 'react'
import Timer from 'components/Timer'

interface CountdownProps {
  nextEventTimestamp?: string
}

const Countdown: React.FC<CountdownProps> = ({ nextEventTimestamp }) => {
  const minutes = 10
  const hours = 2
  const days = 0

  return <Timer minutes={minutes} hours={hours} days={days} />
}

export default Countdown
