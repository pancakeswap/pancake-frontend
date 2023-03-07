import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import { ArticleDataType } from 'utils/transformArticle'
import NextLink from 'next/link'
import { StyledLineClamp } from 'components/StyledLineClamp'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledArticle = styled(Flex)`
  cursor: pointer;
  padding: 24px 16px;
  margin: 0;
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.cardBorder}`};

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 32px 0;
    margin: 0 32px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  }
`

const StyledTagGroup = styled(Flex)`
  flex-wrap: wrap;

  ${Text} {
    &:after {
      content: ',';
      margin: 0 4px;
    }

    &:last-child {
      &:after {
        content: '';
      }
    }
  }
`

interface CardArticleProps {
  article: ArticleDataType
}

const CardArticle: React.FC<React.PropsWithChildren<CardArticleProps>> = ({ article }) => {
  return (
    <StyledArticle flexDirection="column">
      <NextLink passHref href={`/articles/${article?.slug}`}>
        <Flex>
          <Box
            borderRadius={8}
            mr={['8px', '15px', '20px', '58px']}
            overflow="hidden"
            minWidth={['132px', '152px', '192px', '320px']}
            height={['71px', '91px', '111px', '180px']}
          >
            <StyledBackgroundImage imgUrl={article.imgUrl} />
          </Box>
          <Flex overflow="hidden" flexDirection="column" width="100%">
            <Box mb="24px" display={['none', null, null, 'block']}>
              <StyledTagGroup>
                {article?.categories?.map((category: string) => (
                  <Text bold key={category} fontSize="12px" color="textSubtle" textTransform="uppercase">
                    {category}
                  </Text>
                ))}
              </StyledTagGroup>
            </Box>
            <StyledLineClamp
              bold
              line={3}
              ellipsis
              lineHeight={['1.5', '1.2']}
              mb={['8px', '8px', '8px', '24px']}
              fontSize={['14px', '16px', '24px']}
            >
              {article.title}
            </StyledLineClamp>
            <Text ellipsis mb="24px" display={['none', 'none', 'none', 'block']}>
              {article.description}
            </Text>
            <Text mt="auto" textAlign="right" fontSize={['12px', '12px', '14px']} color="textSubtle">
              {article.createAt}
            </Text>
          </Flex>
        </Flex>
      </NextLink>
    </StyledArticle>
  )
}

export default CardArticle
