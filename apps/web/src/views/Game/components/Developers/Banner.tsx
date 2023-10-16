import { Box, Flex, Text, Button, Link, PageSection, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { Decorations } from 'views/Game/components/Decorations'

export const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection index={1} position="relative" hasCurvedDivider={false} background={theme.colors.gradientBubblegum}>
      <Decorations />
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
