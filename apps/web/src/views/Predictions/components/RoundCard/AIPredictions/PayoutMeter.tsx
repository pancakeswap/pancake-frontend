import { Box, BoxProps, Flex, Grid, Text } from '@pancakeswap/uikit'
import Lottie from 'lottie-react'
import styled, { useTheme } from 'styled-components'
import MeterJSON from '../../../../../../public/images/predictions/meter.json'
import MeterDarkJSON from '../../../../../../public/images/predictions/meter_dark.json'

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

const StyledGrid = styled(Grid)`
  margin-top: -3px;
  grid-template-columns: 1fr 1fr 1fr;
`

export const PayoutMeter = ({ bearMultiplier = '0', bullMultiplier = '0', ...props }: PayoutMeterProps) => {
  const isRoundEmpty = bearMultiplier === '0' && bullMultiplier === '0'

  return (
    <Box {...props}>
      <Flex justifyContent="center">
        <AnimatedMeter />
      </Flex>
      <StyledGrid>
        {!isRoundEmpty ? (
          <Text small bold textAlign="right">
            {Math.min(+bearMultiplier, +bullMultiplier)}x
          </Text>
        ) : (
          <div />
        )}
        <Text color="textSubtle" textAlign="center" bold small>
          Payout
        </Text>
        {!isRoundEmpty && (
          <Text small bold>
            {Math.max(+bearMultiplier, +bullMultiplier)}x
          </Text>
        )}
      </StyledGrid>
    </Box>
  )
}
