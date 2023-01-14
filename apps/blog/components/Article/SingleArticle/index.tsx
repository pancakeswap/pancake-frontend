import styled from 'styled-components'
import { Box, Text, Flex, TwitterIcon, TelegramIcon } from '@pancakeswap/uikit'
import HowItWork from 'components/Article/SingleArticle/HowItWork'
import SimilarArticles from 'components/Article/SingleArticle/SimilarArticles'

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

  ${({ theme }) => theme.mediaQueries.md} {
    position: sticky;
    padding-top: 20px;
    flex-direction: column;
  }
`

// https://telegram.me/share/url?url=

const SingleArticle = () => {
  return (
    <Box>
      <Flex
        padding={['0 16px', '0 16px', '0 16px', '0']}
        width={['100%', '100%', '100%', '100%', '828px']}
        margin={['85px auto 40px auto']}
        justifyContent={['flex-start', 'space-between']}
        flexDirection={['column', 'column', 'column', 'row']}
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
        </Flex>
        <StyledSocialIcon>
          <TwitterIcon />
          <TelegramIcon />
        </StyledSocialIcon>
      </Flex>
      <HowItWork />
      <SimilarArticles />
    </Box>
  )
}

export default SingleArticle
