import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { Heading2Text } from '../CompetitionHeadingText'

const StyledHeadingText = styled(Heading2Text)`
  font-size: 24px;
  margin-right: 4px;
`

const Timer: React.FC<{ competitionStartTime?: number; competitionEndTime?: number }> = ({
  competitionStartTime,
  competitionEndTime,
}) => {
  const nowInMs = Date.now()
  const countdownToStart = nowInMs < competitionStartTime
  const countdownToEnd = nowInMs >= competitionStartTime
  //   debugger // eslint-disable-line no-debugger

  const daysCountdown = 1
  const hoursCountdown = 8
  const minutesCountdown = 34

  return (
    <Flex mb="24px" alignItems="flex-end">
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        {countdownToStart ? 'Start:' : 'End:'}
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {daysCountdown}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        d
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {hoursCountdown}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
        h
      </Text>
      <StyledHeadingText background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {minutesCountdown}
      </StyledHeadingText>
      <Text color="#ffff" fontWeight="600" fontSize="16px">
        m
      </Text>
    </Flex>
  )
}

export default Timer
