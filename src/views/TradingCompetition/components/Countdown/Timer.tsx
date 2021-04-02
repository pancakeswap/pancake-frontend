import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import TimerTooltip from './TimerTooltip'

export interface TimerProps {
  timerStage?: string
  minutes?: number
  hours?: number
  days?: number
  showTooltip?: boolean
  blockNumber?: number
  HeadingTextComponent?: React.ElementType
  BodyTextComponent?: React.ElementType
}

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const Timer = ({ minutes, hours, days, showTooltip, HeadingTextComponent, BodyTextComponent }) => {
  return (
    <StyledTimerFlex alignItems="flex-end" showTooltip={showTooltip}>
      <HeadingTextComponent mr="2px">{days}</HeadingTextComponent>
      <BodyTextComponent mr="16px">d</BodyTextComponent>
      <HeadingTextComponent mr="2px">{hours}</HeadingTextComponent>
      <BodyTextComponent mr="16px">h</BodyTextComponent>
      <HeadingTextComponent mr="2px">{minutes}</HeadingTextComponent>
      <BodyTextComponent>m</BodyTextComponent>
    </StyledTimerFlex>
  )
}

const DefaultHeadingTextComponent = ({ children, ...props }) => (
  <Heading size="lg" {...props}>
    {children}
  </Heading>
)
const DefaultBodyTextComponent = ({ children, ...props }) => (
  <Text fontSize="16px" fontWeight="600" {...props}>
    {children}
  </Text>
)

const Wrapper: React.FC<TimerProps> = ({
  timerStage,
  minutes,
  hours,
  days,
  blockNumber,
  showTooltip = false,
  HeadingTextComponent = DefaultHeadingTextComponent,
  BodyTextComponent = DefaultBodyTextComponent,
}) => {
  return (
    <Flex alignItems="flex-end" position="relative">
      <BodyTextComponent mr="16px">{timerStage}</BodyTextComponent>
      {showTooltip ? (
        <TimerTooltip blockNumber={blockNumber}>
          <Timer
            minutes={minutes}
            hours={hours}
            days={days}
            HeadingTextComponent={HeadingTextComponent}
            BodyTextComponent={BodyTextComponent}
            showTooltip={showTooltip}
          />
        </TimerTooltip>
      ) : (
        <Timer
          minutes={minutes}
          hours={hours}
          days={days}
          HeadingTextComponent={HeadingTextComponent}
          BodyTextComponent={BodyTextComponent}
          showTooltip={showTooltip}
        />
      )}
    </Flex>
  )
}

export default Wrapper
