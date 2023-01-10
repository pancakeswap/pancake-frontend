import { Box, BoxProps, Card, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { HeightProps } from 'styled-system'

const StyledBackgroundImage = styled(Box)<{ imgHeight?: number; imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledBlogCard = styled(Box)`
  cursor: pointer;

  &:hover ${StyledBackgroundImage} {
    transform: scale(1.05);
  }
`

interface BlogCardProps extends BoxProps {
  imgUrl: string
  imgHeight?: HeightProps['height']
}

const BlogCard: React.FC<React.PropsWithChildren<BlogCardProps>> = ({ imgUrl, imgHeight, ...props }) => {
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'}>
          <StyledBackgroundImage imgUrl={imgUrl} />
        </Box>
        <Box padding={['15px', '15px', '20px']}>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" bold color="textSubtle">
              Partnership
            </Text>
            <Text fontSize="14px" color="textSubtle">
              June 21 2021
            </Text>
          </Flex>
          <Text bold mt="20px">
            PancakeSwap Info Relaunch in Partnership with $150,000 Bounty Winner — StreamingFast!
          </Text>
        </Box>
      </Card>
    </StyledBlogCard>
  )
}

export default BlogCard
