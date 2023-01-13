import { Box, Text, Flex, Card, Button, ArrowForwardIcon } from '@pancakeswap/uikit'

const HowItWork = () => {
  return (
    <Box width={['663px']} m={['auto']}>
      <Card>
        <Box padding={['24px']}>
          <Flex flexDirection="column" mb={['58px']} width={['300px']}>
            <Text bold fontSize={['24px']} color="primary">
              How does it work?
            </Text>
            <Text bold fontSize={['40px']} m={['16px 0']} lineHeight="110%">
              Learn basics of PancakeSwap
            </Text>
            <Text fontSize={['16px']} color="textSubtle">
              Trade tokens, earn rewards and play to win!
            </Text>
          </Flex>
          <Button endIcon={<ArrowForwardIcon color="currentColor" />}>Learn how</Button>
        </Box>
      </Card>
    </Box>
  )
}

export default HowItWork
