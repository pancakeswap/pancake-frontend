import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { Heading2Text } from '../CompetitionHeadingText'

interface TimerProps {
  timerText?: string
  minutes?: number
  hours?: number
  days?: number
}

const StyledHeadingText = styled(Heading2Text)`
  font-size: 24px;
  margin-right: 4px;
`

const Timer: React.FC<TimerProps> = ({ timerText, minutes, hours, days }) => {
  return (
    <Flex mb="24px" alignItems="flex-end">
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        {timerText}
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {days}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        d
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {hours}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        h
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {minutes}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px">
        m
      </Text>
    </Flex>
  )
}

export default Timer
