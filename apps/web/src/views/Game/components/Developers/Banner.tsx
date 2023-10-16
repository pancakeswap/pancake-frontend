import { Box, Flex, Text, Button, Link, PageSection, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 60%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  z-index: 1;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 40%;
    left: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 40%;
    left: 2%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    right: 0%;
    top: 40%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    right: -1%;
    top: 28%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    right: 8%;
    bottom: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   & :nth-child(4) {
  //     left: 28%;
  //   }
  // }
}`

export const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection index={1} position="relative" hasCurvedDivider={false} background={theme.colors.gradientBubblegum}>
      <Decorations>
        <img src="/images/game/developers/left-1.png" width="79px" height="207px" alt="left1" />
        <img src="/images/game/developers/star.png" width="49px" height="43px" alt="star" />
        <img src="/images/game/developers/right-1.png" width="80px" height="150px" alt="right1" />
        <img src="/images/game/developers/right-2.png" width="109px" height="123px" alt="right2" />
        <img src="/images/game/developers/star.png" width="67px" height="59px" alt="star2" />
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
        <Flex flexDirection="column" alignSelf="center" width={['100%', '100%', '100%', '752px']}>
          <Box mb={['64px']}>
            <Flex>
              <Text bold fontSize={['40px', '40px', '40px', '64px']} color="secondary" lineHeight="110%">
                {t('Build')}
              </Text>
              <Text bold ml="10px" fontSize={['40px', '40px', '40px', '64px']} lineHeight="110%">
                {t('Games')}
              </Text>
            </Flex>
            <Flex flexWrap="wrap">
              <Text bold fontSize="40px" color="secondary" as="span" lineHeight="110%">
                {t('with')}
              </Text>
              <Text bold fontSize="40px" as="span" ml="4px" lineHeight="110%">
                {t('PancakeSwap')}
              </Text>
            </Flex>
          </Box>
          <Text bold mb="32px" maxWidth="520px" lineHeight="26.4px" fontSize={['16px', '16px', '16px', '24px']}>
            {t('Design Games to Captivate 1.5 Million Potential Players')}
          </Text>
          <Flex alignSelf={['center', 'center', 'center', 'auto']}>
            <NextLinkFromReactRouter to="/swap?showTradingReward=true">
              <Button>{t('Start Building')}</Button>
            </NextLinkFromReactRouter>
            <Link href="#howToEarn">
              <Button ml="12px" variant="secondary">
                {`${t('Learn More')}`}
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Image
          width={532}
          height={532}
          alt="banner-image"
          style={{ zIndex: 0 }}
          src="/images/game/developers/banner-bunny.png"
        />
      </Flex>
    </PageSection>
  )
}
