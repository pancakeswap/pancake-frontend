import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Link, PageSection, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { floatingStarsLeft } from 'components/Game/DecorationsAnimation'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { styled } from 'styled-components'

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
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.xl} {
    position: static;
    transform: translateX(0%);
  }
`

const Decorations = styled(Box)`
  display: none;
  position: absolute;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 10%;
    left: -1%;
    animation: ${floatingStarsLeft} 2.5s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
`

export const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isDesktop, isXxl } = useMatchBreakpoints()

  return (
    <StyledPageSection
      index={1}
      position="relative"
      hasCurvedDivider={false}
      background={theme.colors.gradientBubblegum}
    >
      <Decorations>
        <Image src={`${ASSET_CDN}/web/game/developers/piezas-1.png`} width={66.5} height={72} alt="piezas1" />
      </Decorations>
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
            <Link external href="https://forms.gle/WXDhmbfRhQtz4eSt7">
              <Button>{t('Start Building')}</Button>
            </Link>
            <Link external href="https://docs.pancakeswap.finance/products/gaming-platform">
              <Button ml="12px" variant="secondary">
                {`${t('Learn More')}`}
              </Button>
            </Link>
          </Flex>
        </Flex>
        <StyledBunny>
          <Image
            alt="banner-image"
            width={isXxl ? 533 : 323}
            height={isXxl ? 522 : 262}
            style={{
              zIndex: 0,
              minWidth: isXxl ? 533 : 323,
            }}
            src={`${ASSET_CDN}/web/game/developers/game-banner-bunny.png`}
          />
        </StyledBunny>
      </Flex>
    </StyledPageSection>
  )
}
