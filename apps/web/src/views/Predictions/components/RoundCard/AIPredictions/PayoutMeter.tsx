import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'
import Lottie from 'lottie-react'
import { useTheme } from 'styled-components'
import MeterJSON from '../../../../../../public/images/predictions-temp/meter.json'
import MeterDarkJSON from '../../../../../../public/images/predictions-temp/meter_dark.json'

interface PayoutMeterProps extends BoxProps {
  bearMultiplier?: string
  bullMultiplier?: string
}

const AnimatedMeter = (props: BoxProps) => {
  const { isDark } = useTheme()
  return (
    <Box position="relative" {...props}>
      <Lottie animationData={isDark ? MeterDarkJSON : MeterJSON} style={{ width: '110px' }} />
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
      <Flex mt="-3px" justifyContent="center" mx="50px">
        {!isRoundEmpty && (
          <Text small bold>
            {Math.min(+bearMultiplier, +bullMultiplier)}x
          </Text>
        )}
        <Text color="textSubtle" mx="13px" bold small>
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
