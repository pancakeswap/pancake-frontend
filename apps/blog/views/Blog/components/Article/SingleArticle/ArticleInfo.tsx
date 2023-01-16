import styled from 'styled-components'
import { Box, Text, Flex, TwitterIcon, TelegramIcon, Link } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledSocialIcon = styled(Flex)`
  position: static;
  top: 0px;
  right: 0px;
  height: 100%;
  padding-top: 0px;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.lg} {
    position: sticky;
    padding-top: 20px;
    flex-direction: column;
  }
`

const StyledLink = styled(Link)`
  &:hover {
    > svg {
      fill: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const ArticleInfo = () => {
  const router = useRouter()

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
          PancakeSwap Info Relaunch in Partnership with $150,000 Bounty Winner — StreamingFast!
        </Text>
        <Flex mb={['4px']} justifyContent="flex-end">
          <Text bold color="textSubtle" textTransform="uppercase">
            partnership
          </Text>
        </Flex>
        <Text color="textSubtle" mb={['26px']} textAlign="right">
          June 24 2021
        </Text>
        <Box mb="24px" borderRadius={20} overflow="hidden" height={['155px', '200px', '350px', '420px']}>
          <StyledBackgroundImage imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg" />
        </Box>
        <ReactMarkdown>dddd</ReactMarkdown>
      </Flex>
      <StyledSocialIcon>
        <StyledLink
          external
          mb={['0', '0', '0', '0', '28px']}
          mr={['28px', '28px', '28px', '28px', '0']}
          href={`https://twitter.com/share?url=https://blog.pancakeswap.finance${router.asPath}`}
        >
          <TwitterIcon width={40} />
        </StyledLink>
        <StyledLink
          external
          href={`https://telegram.me/share/url?url=https://blog.pancakeswap.finance${router.asPath}`}
        >
          <TelegramIcon width={40} />
        </StyledLink>
      </StyledSocialIcon>
    </Flex>
  )
}

export default ArticleInfo
