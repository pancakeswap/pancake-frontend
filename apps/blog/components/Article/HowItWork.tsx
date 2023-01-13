import styled from 'styled-components'
import { Box, Text, Flex, Card, Button, ArrowForwardIcon } from '@pancakeswap/uikit'

const StyledImage = styled('div')`
  position: absolute;
  width: 251px;
  height: 365px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('/images/how_it_work.png');
  z-index: 1;
  right: 0;
  bottom: 5%;
`

const HowItWork = () => {
  return (
    <Box position="relative" width={['663px']} m={['auto']}>
      <StyledImage />
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
