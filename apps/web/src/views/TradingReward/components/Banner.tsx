import { Box, Flex, Text, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import Image from 'next/image'
import bunnyImage from '../../../../public/images/trading-reward/trading-reward-banner-bunny.png'

const Container = styled(Box)`
  padding: 47px 16px 38px 16px;
  background: linear-gradient(340.33deg, #c1edf0 -11.09%, #eafbf7 32.51%, #ece4fb 96.59%);
`

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  > img {
    position: absolute;
  }
  & :nth-child(1) {
    left: 2%;
    top: 2%;
    width: 69px;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.xl} {
      left: 15%;
      top: 8%;
      width: auto;
    }
  }
  & :nth-child(2) {
    left: 0%;
    bottom: 55%;
    width: 126px;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.xl} {
      left: 15%;
      bottom: 5%;
      width: auto;
    }
  }
  & :nth-child(3) {
    right: 0%;
    top: 0%;
    width: 71px;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.xl} {
      right: 10%;
      top: 15%;
      width: auto;
    }
  }
}`

const TradingRewardBanner = () => {
  return (
    <Container position="relative">
      <Decorations>
        <img src="/images/trading-reward/star1.png" width="155px" height="170px" alt="star1" />
        <img src="/images/trading-reward/star2.png" width="240px" height="187px" alt="star2" />
        <img src="/images/trading-reward/star3.png" width="160px" height="124px" alt="star3" />
      </Decorations>
      <Flex position="relative" zIndex="1">
        <Box>
          <Text bold fontSize="60px" color="secondary">
            Trading Reward
          </Text>
          <Text bold fontSize="40px" color="secondary" mb="16px">
            $42,000
            <Text bold fontSize="40px" color="secondary" as="span" ml="4px">
              in total to be earn!
            </Text>
          </Text>
          <Text maxWidth="404px" bold fontSize="24px" mb="32px" lineHeight="26.4px">
            Earn CAKE while trading your favourite tokens on PancakeSwap.
          </Text>
          <Flex>
            <Button>Start Trading</Button>
            <Button ml="12px" variant="secondary">
              How to Earn?
            </Button>
          </Flex>
        </Box>
        <Box
          m={['auto', 'auto', 'auto', '0']}
          width={['227px', '257px', '327px', '560px']}
          height={['306px', '356px', '406px', '639px']}
        >
          <Image src={bunnyImage} alt="banner-image" />
        </Box>
      </Flex>
    </Container>
  )
}

export default TradingRewardBanner
