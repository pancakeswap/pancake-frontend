import { Box, Flex, Text, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import Image from 'next/image'
import bunnyImage from '../../../../public/images/trading-reward/trading-reward-banner-bunny.png'

const Container = styled(Box)`
  padding: 47px 16px 38px 16px;
  background: linear-gradient(0deg, rgba(193, 237, 240, 1) 0%, rgba(234, 251, 247, 1) 20%, rgba(236, 228, 251, 1) 100%);
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
    top: 10%;
    left: 55%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.xl} {
    }
  }
  & :nth-child(2) {
    top: 50%;
    right: 22%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
    // ${({ theme }) => theme.mediaQueries.xl} {
    // }
  }
  & :nth-child(3) {
    left: 48%;
    bottom: 15%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
    // ${({ theme }) => theme.mediaQueries.xl} {
    // }
  }
}`

const TradingRewardBanner = () => {
  const { t } = useTranslation()

  return (
    <Container position="relative">
      <Decorations>
        <img src="/images/trading-reward/star1.png" width="43px" height="43px" alt="star1" />
        <img src="/images/trading-reward/star2.png" width="71px" height="71px" alt="star2" />
        <img src="/images/trading-reward/star3.png" width="36px" height="36px" alt="star3" />
      </Decorations>
      <Flex
        position="relative"
        zIndex="1"
        width={['100%', '100%', '100%', '1140px']}
        margin="auto"
        justifyContent="space-between"
      >
        <Flex flexDirection="column" alignSelf="center">
          <Text bold fontSize="60px" color="secondary">
            {t('Trading Reward')}
          </Text>
          <Text bold fontSize="40px" color="secondary" mb="16px">
            $42,000
            <Text bold fontSize="40px" color="secondary" as="span" ml="4px">
              {t('in total to be earn!')}
            </Text>
          </Text>
          <Text maxWidth="404px" bold fontSize="24px" mb="32px" lineHeight="26.4px">
            {t('Earn CAKE while trading your favorite tokens on PancakeSwap.')}
          </Text>
          <Flex>
            <Button>{t('Start Trading')}</Button>
            <Button ml="12px" variant="secondary">
              {t('How to Earn?')}
            </Button>
          </Flex>
        </Flex>
        <Box width={['554px']} height={['573px']}>
          <Image src={bunnyImage} alt="banner-image" />
        </Box>
      </Flex>
    </Container>
  )
}

export default TradingRewardBanner
