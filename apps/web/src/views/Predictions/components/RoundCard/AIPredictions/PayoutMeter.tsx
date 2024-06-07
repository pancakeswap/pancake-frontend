import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'

interface PayoutMeterProps extends BoxProps {
  bearMultiplier?: string
  bullMultiplier?: string
}

export const PayoutMeter = ({ bearMultiplier, bullMultiplier, ...props }: PayoutMeterProps) => {
  //   if (!bearMultiplier || !bullMultiplier) return null

  return (
    <Box {...props}>
      <Flex justifyContent="center">
        <img src="/images/predictions-temp/meter.png" alt="Payout" width={100} />
      </Flex>
      <Flex justifyContent="space-between" mx="60px">
        <Text small>{bearMultiplier}</Text>
        <Text color="textSubtle" small>
          Payout
        </Text>
        <Text small>{bullMultiplier}</Text>
      </Flex>
    </Box>
  )
}
