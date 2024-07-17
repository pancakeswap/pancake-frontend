import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerContainer,
  BannerDesc,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSETS_CDN } from 'config'

const bgDesktop = `${ASSETS_CDN}/web/banners/aptos-yield-farming/bunny-desktop.png`
const bgMobile = `${ASSETS_CDN}/web/banners/aptos-yield-farming/bunny-mobile.png`
const floatingCoin = `${ASSETS_CDN}/web/banners/aptos-yield-farming/floating-coin.png`

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 180,
  height: 145,
}

const Desc = () => {
  const { t } = useTranslation()
  return <BannerDesc>{t('Stake LP Tokens to Earn Cake and APT')}</BannerDesc>
}
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/step-by-step-guide-farming-liquidity-provisioning-and-bridging-on-aptos?utm_source=AptosFarm&utm_medium=Website&utm_campaign=Farm&utm_id=AptosFarmPage'

export const AptosYieldFarmingBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const startTradeAction = (
    <LinkExternalAction href={learnMoreLink} color="#280d5f" externalIcon="arrowForward">
      <Flex color="#280d5f" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Read The Guide')}
      </Flex>
    </LinkExternalAction>
  )
  return (
    <BannerContainer background={`url(${ASSETS_CDN}/web/banners/aptos-yield-farming/aptos-bg.png)`}>
      <BannerMain
        badges={
          <Flex alignItems="center">
            <PancakeSwapBadge whiteText />
          </Flex>
        }
        desc={isMobile ? null : <Desc />}
        title={
          <BannerTitle variant="purple">
            {isMobile || isTablet
              ? t('Earn Cake and APT with up to 50% apr on 15+ Pools')
              : t('Earn Dual Incentives with Yield Farming on Aptos PancakeSwap')}
          </BannerTitle>
        }
        actions={startTradeAction}
      />
      <BannerGraphics>
        <Box position="absolute" width="100%" top="100%" left={isTablet && !isMobile ? '5%' : '0%'}>
          <BackgroundGraphic src={bgDesktop} width={468} height={224} md={bgSmVariant} xs={bgXsVariant} />
        </Box>
        <Box position="absolute" width="100%" left={isMobile ? '10%' : '-10%'}>
          <FloatingGraphic src={floatingCoin} width={99} height={99} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
