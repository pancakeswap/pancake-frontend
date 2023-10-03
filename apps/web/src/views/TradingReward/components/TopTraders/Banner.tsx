import { Box, Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import Image from 'next/image'
import bunnyImage from '../../../../../public/images/trading-reward/top-traders-banner.png'

const Container = styled(Box)<{ backgroundColor: string }>`
  padding: 47px 16px 38px 16px;
  background: ${({ backgroundColor }) => backgroundColor};
`

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(100% - 32px);
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    left: 0%;
    bottom: 25%;
  }

  & :nth-child(2) {
    left: 3%;
    bottom: 50%;
  }

  & :nth-child(3) {
    top: 25%;
    right: 0%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    top: 20%;
    right: 13%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    left: 52%;
    bottom: 15%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }

  & :nth-child(6) {
    right: 5%;
    bottom: 30%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(7) {
    top: 2%;
    left: 16%;
    width: 122px;
    height: 90px;
    transformY: (-50%);
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(1), & :nth-child(2), & :nth-child(3), & :nth-child(4), & :nth-child(5), & :nth-child(6) {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & :nth-child(7) {
      left: 25%;
      width: 136px;
      height: 104px;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & :nth-child(7) {
      top: 3%;
      width: 156px;
      height: 124px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    & :nth-child(7) {
      top: 6%;
      left: 56%;
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 100%;

    & :nth-child(1), & :nth-child(2), & :nth-child(3), & :nth-child(4), & :nth-child(5), & :nth-child(6) {
      display: block;
    }
  }
}`

const TopTradersBanner = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <Container
      position="relative"
      backgroundColor={
        isDark
          ? 'radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%)'
          : 'linear-gradient(154.45deg, #C1EDF0 -6.71%, #EAFBF7 31.9%, #D9E7FD 87.95%, #E0DAFE 105.77%)'
      }
    >
      <Decorations>
        <img src="/images/trading-reward/top-traders-1.png" width="101px" height="449px" alt="top-traders-1" />
        <img src="/images/trading-reward/top-traders-2.png" width="49px" height="49px" alt="top-traders-2" />
        <img src="/images/trading-reward/top-traders-3.png" width="156px" height="122px" alt="top-traders-3" />
        <img src="/images/trading-reward/top-traders-4.png" width="23px" height="23px" alt="top-traders-4" />
        <img src="/images/trading-reward/top-traders-5.png" width="21px" height="21px" alt="top-traders-5" />
        <img src="/images/trading-reward/top-traders-2.png" width="67px" height="67px" alt="top-traders-6" />
        <img src="/images/trading-reward/top-traders-6.png" width="156px" height="124px" alt="top-traders-7" />
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
          <Text
            bold
            fontSize="40px"
            color="text"
            fontStyle="italic"
            lineHeight="110%"
            mb={['20px', '20px', '20px', '32px']}
          >
            {t('for  Top Traders!')}
          </Text>
          <Flex mb="16px" flexWrap="wrap">
            <Text bold fontSize="40px" color="secondary" as="span" ml="4px" lineHeight="110%">
              {t('3% trading fee rebate up for grab!')}
            </Text>
          </Flex>
          <Text bold mb="32px" maxWidth="520px" lineHeight="26.4px" fontSize={['16px', '16px', '16px', '24px']}>
            {t('Earn CAKE while trading your favorite tokens on PancakeSwap by being the top traders!')}
          </Text>
          <Flex alignSelf={['center', 'center', 'center', 'auto']}>
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
          width={['233px', '333px', '433px', '533px']}
          height={['222px', '322px', '422px', '522px']}
          m={['auto', 'auto', 'auto', 'auto', 'auto', '0 0 0 auto']}
        >
          <Image src={bunnyImage} alt="banner-image" />
        </Box>
      </Flex>
    </Container>
  )
}

export default TopTradersBanner
