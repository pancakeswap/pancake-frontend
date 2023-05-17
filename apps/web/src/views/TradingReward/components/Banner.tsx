import { Box, Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import Image from 'next/image'
import bunnyImage from '../../../../public/images/trading-reward/trading-reward-banner-bunny.png'

const Container = styled(Box)<{ backgroundColor: string }>`
  padding: 47px 16px 38px 16px;
  background: ${({ backgroundColor }) => backgroundColor};
`

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(100% - 32px);
  height: 60%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 10%;
    left: 5%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 50%;
    right: 0%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }

  & :nth-child(3) {
    left: 10%;
    bottom: 15%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    left: 15%;
    top: 20%;
    width: 66px;
    height: 48px;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    left: 26%;
    bottom: 21%;
    width: 67px;
    height: 121px;
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & :nth-child(4) {
      left: 28%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 90%;
    height: 70%;

    & :nth-child(4) {
      top: 10%;
      left: 18%;
      width: 186px;
      height: 168px;
    }

    & :nth-child(5) {
      left: 16%;
      bottom: 18%;
      width: 167px;
      height: 261px;
      display: block;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    max-width: 1140px;
    height: 100%;

    & :nth-child(1) {
      left: 55%;
    }

    & :nth-child(3) {
      left: 48%;
    }

    & :nth-child(4) {
      left: 55%;
      width: 186px;
      height: 168px;
    }

    & :nth-child(5) {
      left: 58%;
      width: 167px;
      height: 261px;
    }
  }
}`

const TradingRewardBanner = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <Container
      position="relative"
      backgroundColor={
        isDark
          ? 'radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%)'
          : 'linear-gradient(340.33deg, #c1edf0 -11.09%, #eafbf7 32.51%, #ece4fb 96.59%)'
      }
    >
      <Decorations>
        <img src="/images/trading-reward/star1.png" width="43px" height="43px" alt="star1" />
        <img src="/images/trading-reward/star2.png" width="71px" height="71px" alt="star2" />
        <img src="/images/trading-reward/star3.png" width="36px" height="36px" alt="star3" />
        <img src="/images/trading-reward/butter-1.png" width="186px" height="168px" alt="butter1" />
        <img src="/images/trading-reward/butter-2.png" width="167px" height="261px" alt="butter2" />
      </Decorations>
      <Flex
        position="relative"
        zIndex="1"
        margin="auto"
        justifyContent="space-between"
        width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
        flexDirection={[
          'column-reverse',
          'column-reverse',
          'column-reverse',
          'column-reverse',
          'column-reverse',
          'row',
        ]}
      >
        <Flex flexDirection="column" alignSelf="center" width={['100%', '100%', '100%', '700px']}>
          <Text bold fontSize={['40px', '40px', '40px', '60px']} color="secondary" lineHeight="110%">
            {t('Trading Reward')}
          </Text>
          <Flex mb="16px" flexWrap="wrap">
            <Text bold fontSize="40px" color="secondary" as="span" ml="4px" lineHeight="110%">
              {t('5% trading rebate to be earned!')}
            </Text>
          </Flex>
          <Text bold mb="32px" maxWidth="404px" lineHeight="26.4px" fontSize={['16px', '16px', '16px', '24px']}>
            {t('Earn CAKE while trading your favorite tokens on PancakeSwap.')}
          </Text>
          <Flex>
            <Link href="/swap?showTradingReward=true" external>
              <Button>{t('Start Trading')}</Button>
            </Link>
            <Link href="#howToEarn">
              <Button ml="12px" variant="secondary">
                {`${t('How to Earn')}?`}
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Box
          width={['175px', '175px', '175px', '359px']}
          height={['272px', '272px', '272px', '563px']}
          m={['auto', 'auto', 'auto', 'auto', 'auto', '0 0 0 auto']}
        >
          <Image src={bunnyImage} alt="banner-image" />
        </Box>
      </Flex>
    </Container>
  )
}

export default TradingRewardBanner
