import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'
import Timer from 'components/Timer'
import getTimePeriods from 'utils/getTimePeriods'
import { useTranslation } from 'contexts/Localization'

interface CountdownProps {
  secondsRemaining: number
}

const TimerTextComponent = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Countdown: React.FC<CountdownProps> = ({ secondsRemaining }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <Flex display="inline-flex" justifyContent="flex-end" alignItems="flex-end" borderBottom="1px dotted white">
      <Timer
        minutes={minutes}
        hours={hours}
        days={days}
        HeadingTextComponent={({ children }) => (
          <TimerTextComponent mb="-4px" scale="xl" mr="4px">
            {children}
          </TimerTextComponent>
        )}
        BodyTextComponent={({ children }) => <TimerTextComponent mr="8px">{children}</TimerTextComponent>}
      />
      <Heading ml="4px" color="#ffff">
        {t('until the draw')}
      </Heading>
    </Flex>
  )
}

export default Countdown
