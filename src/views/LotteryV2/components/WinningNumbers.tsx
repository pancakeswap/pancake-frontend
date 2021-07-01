import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { parseRetreivedNumber } from '../helpers'
import { PinkBall, LilacBall, TealBall, AquaBall, GreenBall, YellowBall } from '../svgs'

const BallTextWrapper = styled.div`
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`

const BallText = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
  text-shadow: -0.75px -0.75px 0 white, 0.75px -0.75px 0 white, -0.75px 0.75px 0 white, 0.75px 0.75px 0 white;
`

const WinningNumbers: React.FC<{ number: string }> = ({ number }) => {
  const reversedNumber = parseRetreivedNumber(number)
  const numAsArray = reversedNumber.split('')

  return (
    <Flex justifyContent="space-between">
      <Box position="relative" mr="4px">
        <PinkBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[0]}</BallText>
        </BallTextWrapper>
      </Box>
      <Box position="relative" mr="4px">
        <LilacBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[1]}</BallText>
        </BallTextWrapper>
      </Box>
      <Box position="relative" mr="4px">
        <TealBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[2]}</BallText>
        </BallTextWrapper>
      </Box>
      <Box position="relative" mr="4px">
        <AquaBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[3]}</BallText>
        </BallTextWrapper>
      </Box>
      <Box position="relative" mr="4px">
        <GreenBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[4]}</BallText>
        </BallTextWrapper>
      </Box>
      <Box position="relative" mr="4px">
        <YellowBall width="32px" height="32px" />
        <BallTextWrapper>
          <BallText bold>{numAsArray[5]}</BallText>
        </BallTextWrapper>
      </Box>
    </Flex>
  )
}

export default WinningNumbers
