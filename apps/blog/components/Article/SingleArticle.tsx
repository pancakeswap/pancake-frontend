import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import HowItWork from 'components/Article/HowItWork'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const SingleArticle = () => {
  return (
    <Flex flexDirection="column">
      <Box width={['748px']} margin={['85px auto 40px auto']}>
        <Text bold fontSize="40px" mb={['26px']}>
          PancakeSwap Info Relaunch in Partnership with $150,000 Bounty Winner — StreamingFast!
        </Text>
        <Flex mb={['4px']} justifyContent="flex-end">
          <Text bold color="textSubtle" textTransform="uppercase">
            partnership
          </Text>
        </Flex>
        <Text color="textSubtle" mb={['26px']} textAlign="right">
          June 24 2021
        </Text>
        <Box borderRadius={20} overflow="hidden" height={['420px']}>
          <StyledBackgroundImage imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg" />
        </Box>
      </Box>
      <HowItWork />
      <Box>123</Box>
    </Flex>
  )
}

export default SingleArticle
