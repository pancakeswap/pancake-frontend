import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledArticle = styled(Flex)`
  cursor: pointer;
  padding: 24px 16px;
  margin: 0;
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.cardBorder}`};

  &:hover ${StyledBackgroundImage} {
    opacity: 0.8;
    transform: scale(1.05);
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 32px 0;
    margin: 0 32px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  }
`

const CardArticle = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/blog/article/123')
  }

  return (
    <StyledArticle flexDirection="column" onClick={handleClick}>
      <Flex>
        <Box
          borderRadius={8}
          mr={['8px', '15px', '20px', '58px']}
          overflow="hidden"
          minWidth={['132px', '152px', '192px', '320px']}
          height={['71px', '91px', '111px', '180px']}
        >
          <StyledBackgroundImage imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg" />
        </Box>
        <Flex flexDirection="column">
          <Box mb="24px" display={['none', null, null, 'block']}>
            <Text display="inline" bold color="textSubtle" textTransform="uppercase">
              ifo
            </Text>
          </Box>
          <Text bold lineHeight="100%" mb={['8px', '8px', '8px', '24px']} fontSize={['12px', '14px', '16px', '24px']}>
            PancakeSwap Info Relaunch in Partnership with $150,000 Bounty Winner — StreamingFast!
          </Text>
          <Text display={['none', null, null, 'block']} mb="24px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Text textAlign="right" fontSize={['12px', '12px', '14px']} color="textSubtle">
            June 22 2021
          </Text>
        </Flex>
      </Flex>
    </StyledArticle>
  )
}

export default CardArticle
