import styled from 'styled-components'
import { Box, Text, Flex, ReactMarkdown } from '@pancakeswap/uikit'
import useSWR from 'swr'
import Balancer from 'react-wrap-balancer'
import { ArticleDataType } from 'utils/transformArticle'
import { useRouter } from 'next/router'
import SocialIcon from 'components/Article/SingleArticle/SocialIcon'

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

const ArticleInfo = () => {
  const router = useRouter()
  const { data: article } = useSWR<ArticleDataType>('/article')

  const handleClickTag = (category: string) => {
    router.push(`/?category=${category}#all`)
  }

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
          <Balancer>{article?.title}</Balancer>
        </Text>
        <StyledTagGroup justifyContent="flex-end">
          {article?.categories.map((category: string) => (
            <Text
              style={{ cursor: 'pointer' }}
              onClick={() => handleClickTag(category)}
              key={category}
              bold
              color="textSubtle"
              textTransform="uppercase"
            >
              {category}
            </Text>
          ))}
        </StyledTagGroup>
        <Text color="textSubtle" mb={['26px']} textAlign="right">
          {article?.createAt}
        </Text>
        <Box mb="24px" height={['155px', '200px', '350px', '420px']}>
          <StyledBackgroundImage imgUrl={article?.imgUrl ?? ''} />
        </Box>
        <Box mb="24px" display={['block', 'block', 'block', 'none']}>
          <SocialIcon />
        </Box>
        {article?.content && <ReactMarkdown>{article?.content}</ReactMarkdown>}
      </Flex>
      <Box display={['none', 'none', 'none', 'block']}>
        <SocialIcon />
      </Box>
    </Flex>
  )
}

export default ArticleInfo
