import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  PageSection,
  NextLinkFromReactRouter,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { Decorations } from 'components/Game/Developers/Decorations'

const StyledPageSection = styled(PageSection)`
  padding: 32px 0;
  width: 100%;
  overflow: hidden;

  > div {
    padding: 0;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 72px 0;
  }
`

const StyledBunny = styled(Box)`
  position: absolute;
  right: -20%;
  bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    right: -14%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    position: static;
  }
`

export const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <StyledPageSection
      index={1}
      position="relative"
      hasCurvedDivider={false}
      background={theme.colors.gradientBubblegum}
    >
      <Decorations />
      <Flex
        position="relative"
        zIndex="1"
        margin="auto"
        justifyContent="space-between"
        height="100%"
        width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
        paddingBottom={['387px', '387px', '387px', '387px', '387px', '0']}
        flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}
      >
        <Flex
          flexDirection="column"
          alignSelf="center"
          paddingLeft={['24px', '24px', '24px', '24px', '24px', '24px', '0']}
          marginTop={['0', '0', '0', '0', '0', '-40px']}
          width={['100%', '100%', '100%', '100%', '100%', '752px']}
        >
          <Box mb={['14px', '14px', '14px', '14px', '14px', '64px']}>
            <Flex>
              <Text bold fontSize={['40px', '40px', '40px', '40px', '64px']} color="secondary" lineHeight="110%">
                {t('Build')}
              </Text>
              <Text bold ml="10px" fontSize={['40px', '40px', '40px', '40px', '64px']} lineHeight="110%">
                {t('Games')}
              </Text>
            </Flex>
            {isDesktop && (
              <Flex flexWrap="wrap">
                <Text bold fontSize="40px" color="secondary" as="span" lineHeight="110%">
                  {t('with')}
                </Text>
                <Text bold fontSize="40px" as="span" ml="4px" lineHeight="110%">
                  {t('PancakeSwap')}
                </Text>
              </Flex>
            )}
          </Box>
          <Text
            bold
            mb={['24px', '24px', '24px', '24px', '32px']}
            maxWidth={['100%', '100%', '100%', '100%', '100%', '520px']}
            lineHeight="26.4px"
            fontSize={['16px', '16px', '16px', '16px', '24px']}
          >
            {t('Design Games to Captivate 1.5 Million Potential Players')}
          </Text>
          <Flex alignSelf={['flex-start', 'flex-start', 'flex-start', 'auto']}>
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
        <StyledBunny>
          <Image
            width={isDesktop ? 532 : 354}
            height={isDesktop ? 532 : 354}
            alt="banner-image"
            style={{ zIndex: 0 }}
            src="/images/game/developers/banner-bunny.png"
          />
        </StyledBunny>
      </Flex>
    </StyledPageSection>
  )
}
