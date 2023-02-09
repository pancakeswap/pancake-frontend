import { Box, Card, Flex, Text } from '@pancakeswap/uikit'

const CommissionInfo = () => {
  return (
    <Box width={['387px']}>
      <Card>
        <Box padding={['24px']}>
          <Flex flexDirection={['column']}>
            <Text bold fontSize={['12px']} textTransform="uppercase">
              active friends
            </Text>
            <Text bold>23</Text>
          </Flex>
        </Box>
      </Card>
    </Box>
  )
}

export default CommissionInfo
