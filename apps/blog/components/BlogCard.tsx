import { Box, BoxProps, Card, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import NextImage from 'next/image'
import { HeightProps } from 'styled-system'
import { ArticleDataType } from 'utils/transformArticle'

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
  imgAlt: string
  article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

const BlogCard: React.FC<React.PropsWithChildren<BlogCardProps>> = ({
  article,
  imgUrl,
  imgAlt,
  imgHeight,
  ...props
}) => {
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'} position="relative">
          <NextImage src={imgUrl} alt={imgAlt} fill style={{ objectFit: 'cover' }} />
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
