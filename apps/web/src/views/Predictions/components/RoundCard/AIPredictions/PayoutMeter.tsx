import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'

interface PayoutMeterProps extends BoxProps {
  bearMultiplier?: string
  bullMultiplier?: string
}

const rotatePointerAnimation = keyframes`
  0% {
    transform: rotate(-70deg);
  }
  10% {
    transform: rotate(-60deg);
  }
  50% {
    transform: rotate(60deg);
  }
  60%{
    transform: rotate(50deg);
  }
  100% {
    transform: rotate(70deg);
  }
`

const MeterPointerImage = styled.img`
  position: absolute;
  left: 46px;
  bottom: 3px;

  transform-origin: bottom;
  animation: ${rotatePointerAnimation} 2s alternate infinite ease-in-out;

  ${({ theme }) =>
    theme.isDark &&
    `
  filter: invert(100%) grayscale(100%) sepia(100%) saturate(0%);
  `}
`

const AnimatedMeter = (props: BoxProps) => {
  return (
    <Box position="relative" {...props}>
      <img src="/images/predictions-temp/pointer.svg" alt="Payout Meter" width={100} />
      <MeterPointerImage src="/images/predictions-temp/meter-pointer.svg" alt="Payout Pointer" width={9} />
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
