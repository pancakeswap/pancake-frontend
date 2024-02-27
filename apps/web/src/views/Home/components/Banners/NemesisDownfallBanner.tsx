import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Image, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

// import { ASSET_CDN } from 'config/constants/endpoints'
// const floatingAsset = `${ASSET_CDN}/web/banners/nemesis-downfall/floating-item.png`
// const bgDesktop = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-desktop.png`
// const bgMobile = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-mobile.png`
// const logo = `${ASSET_CDN}/web/banners/nemesis-downfall/logo.png`
// const bgImage = `${ASSET_CDN}/web/banners/nemesis-downfall/background-image.png`

const floatingAsset = `/images/nemesis-downfall/floating-item.png`
const bgDesktop = `/images/nemesis-downfall/bg-desktop.png`
const bgMobile = `/images/nemesis-downfall/bg-mobile.png`
const logo = `/images/nemesis-downfall/logo-1.png`
const bgImage = `/images/nemesis-downfall/background-image.jpg`

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 218,
  height: 182,
}

const StyledButton = styled(Button)`
  color: #ffffff;
  background: #812b21;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.2);

  &:hover > a {
    text-decoration: none;
  }
`

export const NemesisDownfallBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isXxl } = useMatchBreakpoints()

  return (
    <BannerContainer background={`url('${bgImage}')`}>
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge whiteText />
            <Box style={{ alignSelf: 'center' }} ml="8px" width={isMobile ? 54 : 98} height={isMobile ? 11 : 20}>
              <Image src={logo} alt="logo" width={isMobile ? 54 : 98} height={isMobile ? 11 : 20} />
            </Box>
          </Flex>
        }
        title={
          <BannerTitle variant="orange">
            {isXxl
              ? t('Nemesis Downfall Now Live on PancakeSwap Gaming Marketplace')
              : t('Nemesis Downfall Now on PancakeSwap')}
          </BannerTitle>
        }
        actions={
          isMobile ? (
            <LinkExternalAction color="white" href="https://pancakeswap.games" style={{ alignItems: 'center' }}>
              {t('Play Now')}
            </LinkExternalAction>
          ) : (
            <>
              <StyledButton scale={isXxl ? 'md' : 'sm'}>
                <Link external href="https://pancakeswap.games">
                  <Text
                    bold
                    mr="4px"
                    color="white"
                    textTransform={isMobile ? 'uppercase' : 'capitalize'}
                    fontSize={isMobile ? '12px' : '16px'}
                  >
                    {t('Play Now')}
                  </Text>
                  <OpenNewIcon color="white" />
                </Link>
              </StyledButton>
              <LinkExternalAction
                ml="8px"
                color="white"
                style={{ alignItems: 'center' }}
                href="https://blog.pancakeswap.finance/articles/introducing-nemesis-downfall-pancake-swap-s-latest-game-fi-release"
              >
                {t('Learn More')}
              </LinkExternalAction>
            </>
          )
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
