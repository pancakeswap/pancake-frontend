import { ArticleDataType } from '@pancakeswap/blog'
import { Box, BoxProps, Card, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { HeightProps } from 'styled-system'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledBlogCard = styled(Box)`
  cursor: pointer;
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

interface BlogCardProps extends BoxProps {
  imgUrl: string
  article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

const BlogCard: React.FC<React.PropsWithChildren<BlogCardProps>> = ({ article, imgUrl, imgHeight, ...props }) => {
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'}>
          <StyledBackgroundImage imgUrl={imgUrl} />
        </Box>
        <Box padding={['15px', '15px', '20px']}>
          <Flex justifyContent="space-between">
            <StyledTagGroup>
              {article?.categories.map((category: string) => (
                <Text bold key={category} fontSize="12px" color="textSubtle" textTransform="uppercase">
                  {category}
                </Text>
              ))}
            </StyledTagGroup>
            <Text fontSize="14px" color="textSubtle">
              {article?.createAt}
            </Text>
          </Flex>
          <Text ellipsis bold mt="20px">
            {article?.title}
          </Text>
        </Box>
      </Card>
    </StyledBlogCard>
  )
}

export default BlogCard
