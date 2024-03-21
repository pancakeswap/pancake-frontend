import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, CalenderIcon, Card, Flex, Link, LocationIcon, OpenNewIcon, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { HeightProps } from 'styled-system'
import { V4ArticleDataType } from 'views/LandingV4/config/types'

const StyledBackgroundImage = styled(Box)`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
`

const CircleOpenNew = styled(Flex)<{ $isHover: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  z-index: 1;
  justify-content: center;
  transform: translateY(20px);
  opacity: 0;
  border: ${({ theme }) => `solid 2px ${theme.colors.cardBorder}`};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ $isHover }) =>
    $isHover
      ? `
        opacity: 1;
        transition: 0.3s;
        transform: translateY(0);
      `
      : `
        opacity: 0;
        transition: 0.3s;
        transform: translateY(20);
      `};
`

const StyledBlogCard = styled(Link)`
  display: flex;
  width: 100%;

  &:hover {
    text-decoration: initial;

    .title {
      transition: 0.3s;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
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
  article?: V4ArticleDataType
  slug?: string
  imgHeight?: HeightProps['height']
}

export const BlogCard: React.FC<React.PropsWithChildren<BlogCardProps>> = ({
  isAllBlog,
  isSpecialLayout,
  article,
  imgUrl,
  slug,
  imgHeight,
  ...props
}) => {
  const { t } = useTranslation()
  const [isHover, setIsHover] = useState(false)

  return (
    <StyledBlogCard
      {...props}
      external
      href={article?.newsOutBoundLink || `https://blog.pancakeswap.finance/articles/${slug}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Card style={{ width: '100%' }}>
        <Flex
          height="100%"
          width="100%"
          flexDirection={isSpecialLayout ? ['column', 'column', 'column', 'column', 'row-reverse'] : ['column']}
        >
          <Box
            position="relative"
            overflow="hidden"
            width={['100%']}
            minHeight={isSpecialLayout ? ['200px', '200px', '200px', '200px', '360px'] : imgHeight ?? '200px'}
            height={isSpecialLayout ? ['200px', '200px', '200px', '200px', '360px'] : imgHeight ?? '200px'}
          >
            <StyledBackgroundImage style={{ backgroundImage: `url(${imgUrl})` }} />
            <CircleOpenNew $isHover={isHover}>
              <OpenNewIcon width={20} height={20} color="primary" />
            </CircleOpenNew>
          </Box>
          <Flex
            flexDirection="column"
            padding={['15px', '15px', '20px']}
            height={isSpecialLayout ? ['100%', '100%', '100%', '100%', '360px'] : '100%'}
          >
            <StyledLineClamp
              className="title"
              ellipsis
              line={2}
              bold
              fontSize={isAllBlog ? ['20px'] : ['20px', '20px', '24px']}
              lineHeight={isAllBlog ? ['24px'] : ['24px', '24px', '28px']}
            >
              {article?.title}
            </StyledLineClamp>
            <StyledLineClamp
              bold
              line={3}
              ellipsis
              color="textSubtle"
              m={['8px 0 20px 0']}
              fontSize={['12px', '12px', '14px']}
              lineHeight={['20px', '20px', '18px']}
            >
              {article?.description}
            </StyledLineClamp>
            {article?.eventStartToEndTime || article?.location ? (
              <Flex mt="auto" flexDirection="column">
                <Flex>
                  <CalenderIcon width={20} height={20} />
                  <Text ml="8px" fontSize={14} bold>
                    {article?.eventStartToEndTime}
                  </Text>
                </Flex>
                <Flex mt="8px">
                  <LocationIcon width={20} height={20} />
                  <Text ml="8px" fontSize={14} bold>
                    {article?.location}
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <Flex mt="auto" flexDirection={isAllBlog ? ['column'] : ['column', 'row']}>
                <Text mr="auto" bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                  {t('From: %platform%', {
                    platform: article?.newsOutBoundLink ? article?.newsFromPlatform : t('Official'),
                  })}
                </Text>
                <Text bold fontSize={['12px', '12px', '14px']} color="textSubtle">
                  {article?.createAt}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card>
    </StyledBlogCard>
  )
}
