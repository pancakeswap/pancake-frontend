import { ArticleDataType } from '@pancakeswap/blog'
import { useTranslation } from '@pancakeswap/localization'
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
  const { t } = useTranslation()
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Flex
          width="100%"
          flexDirection={isSpecialLayout ? ['column', 'column', 'column', 'column', 'row-reverse'] : ['column']}
        >
          <Box
            overflow="hidden"
            width={isSpecialLayout ? ['100%', '100%', '100%', '100%', '180%'] : ['100%']}
            height={isSpecialLayout ? ['200px', '200px', '200px', '200px', '400px'] : imgHeight ?? '200px'}
          >
            <StyledBackgroundImage style={{ backgroundImage: `url(${imgUrl})` }} />
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
              {article?.title}
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
              {article?.description}
            </StyledLineClamp>
            <Flex mt="auto" flexDirection={isAllBlog ? ['column'] : ['column', 'row']}>
              <Text mr="auto" bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                {t('From: %platform%', { platform: article?.newsOutBoundLink ? t('Third Party') : t('Official') })}
              </Text>
              <Text bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                {article?.createAt}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </StyledBlogCard>
  )
}
