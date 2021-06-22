import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'
import Timer from 'components/Timer'
import getTimePeriods from 'utils/getTimePeriods'

interface CountdownProps {
  secondsRemaining: number
  preCountdownText?: string
  postCountdownText?: string
}

const TimerTextComponent = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

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
        HeadingTextComponent={({ children }) => (
          <TimerTextComponent mb="-4px" scale="xl" mr="4px">
            {children}
          </TimerTextComponent>
        )}
        BodyTextComponent={({ children }) => <TimerTextComponent mr="8px">{children}</TimerTextComponent>}
      />
      {postCountdownText && (
        <Heading ml="4px" color="#ffff">
          {postCountdownText}
        </Heading>
      )}
    </Flex>
  )
}

export default Countdown
