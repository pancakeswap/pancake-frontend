import styled from 'styled-components'
import { Box, Text, Flex, Button } from '@pancakeswap/uikit'
import SingleArticle from 'components/Article/SingleArticle'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 80px auto;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1160px;
  }
`

const StyledTagContainer = styled(Box)`
  display: none;
  width: 194px;
  margin-right: 25px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: flex;
    flex-direction: column;
  }
`

const StyledCard = styled(Flex)`
  width: 100%;
  border-radius: 0;
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.xxl} {
    border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
    border-bottom: ${({ theme }) => `3px solid ${theme.colors.cardBorder}`};
    border-radius: ${({ theme }) => theme.radii.card};
  }
`

const Article = () => {
  return (
    <StyledArticleContainer>
      <Text
        bold
        mb={['12px', '12px', '12px', '35px']}
        ml={['16px', '16px', '16px', '20px']}
        fontSize={['24px', '24px', '24px', '40px']}
        color="secondary"
      >
        All articles
      </Text>
      <Flex>
        <StyledTagContainer>
          <Button display="block" width="fit-content" scale="sm" variant="subtle" mb="28px">
            All
          </Button>
          <Button display="block" width="fit-content" scale="sm" variant="light">
            Vote
          </Button>
        </StyledTagContainer>
        <Flex width="100%">
          <StyledCard style={{ width: '100%' }}>
            <Box>
              <SingleArticle />
              <SingleArticle />
            </Box>
          </StyledCard>
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}

export default Article
