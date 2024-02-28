import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Image, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'

const floatingAsset = `${ASSET_CDN}/web/banners/nemesis-downfall/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-mobile.png`
const logo = `${ASSET_CDN}/web/banners/nemesis-downfall/logo-1.png`
const bgImage = `${ASSET_CDN}/web/banners/nemesis-downfall/background-image.png`

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

export const NemesisDownfallBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

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
            {isMobile || isTablet
              ? t('Nemesis Downfall Now on PancakeSwap')
              : t('Nemesis Downfall Now Live on PancakeSwap Gaming Marketplace')}
          </BannerTitle>
        }
        actions={
          isMobile ? (
            <LinkExternalAction
              mb="20px"
              color="white"
              href="https://pancakeswap.games"
              style={{ alignItems: 'center' }}
            >
              {t('Play Now')}
            </LinkExternalAction>
          ) : (
            <BannerActionContainer
              firstButtonTitle={t('Play Now')}
              firstButtonLink="https://pancakeswap.games"
              firstButtonBackgroundColor="#812b21"
              firstButtonTextColor="white"
              firstButtonBoxShadowColor="inset 0px -2px 0px rgba(0, 0, 0, 0.2)"
              secondButtonTitle={t('Learn More')}
              secondButtonTextColor="white"
              secondButtonLink="https://blog.pancakeswap.finance/articles/introducing-nemesis-downfall-pancake-swap-s-latest-game-fi-release"
            />
          )
        }
      />
      <BannerGraphics mb={['20px', '10px', '10px', '10px', '0']}>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
