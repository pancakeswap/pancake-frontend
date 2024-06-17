import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'
import Lottie from 'lottie-react'
import MeterJSON from '../../../../../../public/images/predictions-temp/meter.json'

interface PayoutMeterProps extends BoxProps {
  bearMultiplier?: string
  bullMultiplier?: string
}

const AnimatedMeter = (props: BoxProps) => {
  return (
    <Box position="relative" {...props}>
      <Lottie animationData={MeterJSON} style={{ width: '110px' }} />
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
      <Flex mt="-3px" justifyContent={isRoundEmpty ? 'center' : 'space-between'} mx="50px" position="relative">
        {!isRoundEmpty && (
          <Text small bold>
            {Math.min(+bearMultiplier, +bullMultiplier)}x
          </Text>
        )}
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
        {!isRoundEmpty && (
          <Text small bold>
            {Math.max(+bearMultiplier, +bullMultiplier)}x
          </Text>
        )}
      </Flex>
    </Box>
  )
}
