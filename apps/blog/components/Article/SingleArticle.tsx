import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const StyledBackgroundImage = styled(Box)<{ imgHeight?: number; imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledArticle = styled(Flex)`
  cursor: pointer;
  padding: 32px 0;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};

  &:hover ${StyledBackgroundImage} {
    opacity: 0.8;
    transform: scale(1.05);
  }
`

const SingleArticle = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/blog/123')
  }

  return (
    <StyledArticle flexDirection="column" onClick={handleClick}>
      <Flex>
        <Box mr="58px" borderRadius={8} overflow="hidden" minWidth="320px" height={['180px']}>
          <StyledBackgroundImage imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg" />
        </Box>
        <Flex flexDirection="column">
          <Flex mb="24px">
            <Text bold color="textSubtle" textTransform="uppercase">
              ifo
            </Text>
          </Flex>
          <Text bold fontSize="24px" lineHeight="100%">
            PancakeSwap Info Relaunch in Partnership with $150,000 Bounty Winner — StreamingFast!
          </Text>
          <Text m="24px 0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Text textAlign="right" fontSize="14px" color="textSubtle">
            June 22 2021
          </Text>
        </Flex>
      </Flex>
    </StyledArticle>
  )
}

export default SingleArticle
