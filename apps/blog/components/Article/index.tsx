import { Box, Text, Flex, Card, Button } from '@pancakeswap/uikit'

const Article = () => {
  return (
    <Box width={['100%', '100%', '1160px']} m="80px auto">
      <Text bold mb="35px" ml="20px" fontSize={['40px']} color="secondary">
        All articles
      </Text>
      <Flex>
        <Flex mr="25px" width={['194px']} flexDirection="column">
          <Button width="fit-content" scale="sm" variant="subtle" mb="28px">
            All
          </Button>
          <Button width="fit-content" scale="sm" variant="light">
            Vote
          </Button>
        </Flex>
        <Flex width="100%">
          <Card style={{ width: '100%' }}>
            <Box padding="32px">123</Box>
          </Card>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Article
