import styled from 'styled-components'
import { Box, Text, Flex, Card, Button } from '@pancakeswap/uikit'
import SingleArticle from 'components/Article/SingleArticle'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 80px auto;

  @media screen and (min-width: 1200px) {
    width: 1160px;
  }
`

const Article = () => {
  return (
    <StyledArticleContainer>
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
            <Box padding="32px">
              <SingleArticle />
              <SingleArticle />
            </Box>
          </Card>
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}

export default Article
