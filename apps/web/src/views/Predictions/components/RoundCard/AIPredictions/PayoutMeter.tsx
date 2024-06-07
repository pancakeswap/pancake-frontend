import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'

interface PayoutMeterProps extends BoxProps {
  bearMultiplier?: string
  bullMultiplier?: string
}

const rotatePointerAnimation = keyframes`
  0% {
    transform: rotate(-90deg);
  }
  30%{
    transform: rotate(10deg);
  }
    70% {
    transform: rotate(55deg);
  }
  80% {
    transform: rotate(60deg);
  }
  90% {
    transform: rotate(50deg);
  }
  100% {
    transform: rotate(70deg);
  }
`

const MeterPointerImage = styled.img`
  position: absolute;
  left: 46px;
  bottom: 0;

  transform-origin: bottom;
  animation: ${rotatePointerAnimation} 2s alternate infinite;
`

const AnimatedMeter = (props: BoxProps) => {
  return (
    <Box position="relative" {...props}>
      <img src="/images/predictions-temp/meter.png" alt="Payout Meter" width={100} />
      <MeterPointerImage src="/images/predictions-temp/meter-pointer.png" alt="Payout Pointer" width={16} />
    </Box>
  )
}

export const PayoutMeter = ({ bearMultiplier = '0', bullMultiplier = '0', ...props }: PayoutMeterProps) => {
  const isRoundEmpty = bearMultiplier === '0' && bullMultiplier === '0'

  return (
    <Box {...props}>
      <Flex justifyContent="center">
        <AnimatedMeter />
      </Flex>
      <Flex justifyContent={isRoundEmpty ? 'center' : 'space-between'} mx="50px" position="relative">
        {!isRoundEmpty && <Text small>{Math.min(+bearMultiplier, +bullMultiplier)}x</Text>}
        <Text
          color="textSubtle"
          style={{
            position: !isRoundEmpty ? 'absolute' : undefined,
            left: '30%',
            bottom: '0',
          }}
          bold
          small
        >
          Payout
        </Text>
        {!isRoundEmpty && <Text small>{Math.max(+bearMultiplier, +bullMultiplier)}x</Text>}
      </Flex>
    </Box>
  )
}
