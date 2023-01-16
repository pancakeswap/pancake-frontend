import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import ReactMarkdown from 'react-markdown'
import useSWR from 'swr'
import { ArticleType } from 'views/Blog/utils/transformArticle'
import SocialIcon from 'views/Blog/components/Article/SingleArticle/SocialIcon'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledTagGroup = styled(Flex)`
  flex-wrap: wrap;
  margin-bottom: 4px;

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

const StyledMarkDown = styled(Box)`
  * {
    margin-bottom: 16px;
  }

  p {
    line-height: 1.5;
  }

  h1,
  h2,
  h3,
  h4 {
    font-weight: 600;
    font-size: 24px;
    margin: 24px 0;
  }
`

const ArticleInfo = () => {
  const { data: article } = useSWR<ArticleType>('/article')

  return (
    <Flex
      padding={['0 16px', '0 16px', '0 16px', '0 16px', '0']}
      width={['100%', '100%', '100%', '100%', '828px']}
      margin={['45px auto 40px auto', '45px auto 40px auto', '45px auto 40px auto', '85px auto 40px auto']}
      justifyContent={['flex-start', 'space-between']}
      flexDirection={['column', 'column', 'column', 'column', 'row']}
    >
      <Flex flexDirection="column" width={['100%', '100%', '100%', '100%', '748px']}>
        <Text bold fontSize={['32px', '32px', '40px']} mb={['26px']}>
          {article?.title}
        </Text>
        <StyledTagGroup justifyContent="flex-end">
          {article?.categories.map((category: string) => (
            <Text bold color="textSubtle" textTransform="uppercase">
              {category}
            </Text>
          ))}
        </StyledTagGroup>
        <Text color="textSubtle" mb={['26px']} textAlign="right">
          {article?.publishedAt}
        </Text>
        <Box mb="24px" borderRadius={20} overflow="hidden" height={['155px', '200px', '350px', '420px']}>
          <StyledBackgroundImage imgUrl={article?.imgUrl ?? ''} />
        </Box>
        <Box mb="24px" display={['block', 'block', 'block', 'none']}>
          <SocialIcon />
        </Box>
        {article?.content && (
          <StyledMarkDown>
            <ReactMarkdown>{article?.content}</ReactMarkdown>
          </StyledMarkDown>
        )}
      </Flex>
      <Box display={['none', 'none', 'none', 'block']}>
        <SocialIcon />
      </Box>
    </Flex>
  )
}

export default ArticleInfo
