import { ArticleDataType } from '@pancakeswap/blog'
import { Box, BoxProps, Card, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { HeightProps } from 'styled-system'

const StyledBackgroundImage = styled(Box)`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
`

const StyledBlogCard = styled(Box)`
  cursor: pointer;
`

const StyledLineClamp = styled(Text)<{ line?: number }>`
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: ${({ line }) => line ?? 1};
  -webkit-box-orient: vertical;
`

interface BlogCardProps extends BoxProps {
  isAllBlog?: boolean
  isSpecialLayout?: boolean
  imgUrl?: string
  article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

export const BlogCard: React.FC<React.PropsWithChildren<BlogCardProps>> = ({
  isAllBlog,
  isSpecialLayout,
  article,
  imgUrl,
  imgHeight,
  ...props
}) => {
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Flex
          width="100%"
          flexDirection={isSpecialLayout ? ['column', 'column', 'column', 'column', 'row-reverse'] : ['column']}
        >
          <Box
            overflow="hidden"
            width={isSpecialLayout ? ['100%', '100%', '100%', '100%', '130%'] : ['100%']}
            height={isSpecialLayout ? ['200px', '200px', '200px', '200px', '400px'] : imgHeight ?? '200px'}
          >
            {/* <StyledBackgroundImage style={{ backgroundImage: `url(${imgUrl})` }} /> */}
            <StyledBackgroundImage
              style={{
                backgroundImage: `url('https://img.freepik.com/free-vector/gradient-geometric-modern-background-design_826849-4176.jpg?w=1800&t=st=1708491776~exp=1708492376~hmac=1a36ca65d7f91ebdf21c9052f666b6624283a18b69c9caf5219749cc20889899')`,
              }}
            />
          </Box>
          <Flex
            flexDirection="column"
            padding={['15px', '15px', '20px']}
            height={isSpecialLayout ? ['100%', '100%', '100%', '100%', '400px'] : '100%'}
          >
            <StyledLineClamp
              ellipsis
              line={2}
              bold
              fontSize={isAllBlog ? ['20px'] : ['20px', '20px', '24px']}
              lineHeight={isAllBlog ? ['24px'] : ['24px', '24px', '28px']}
            >
              {/* {article?.title} */}
              Unexpected meteor shower lights up the night sky, creating a stunning celestial spectacle
            </StyledLineClamp>
            <StyledLineClamp
              line={2}
              bold
              ellipsis
              color="textSubtle"
              m={['8px 0 20px 0']}
              fontSize={['12px', '12px', '14px']}
              lineHeight={['20px', '20px', '18px']}
            >
              {/* {article?.desc} */}
              Prepare for an extraordinary celestial display as a surprise meteor shower transforms the night sky into a
              breathtaking cosmic masterpiece
            </StyledLineClamp>
            <Flex mt="auto" flexDirection={isAllBlog ? ['column'] : ['column', 'row']}>
              <Text mr="auto" bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                From: Platform Name
              </Text>
              <Text bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                {/* {article?.createAt} */}
                2012-12-23
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </StyledBlogCard>
  )
}
