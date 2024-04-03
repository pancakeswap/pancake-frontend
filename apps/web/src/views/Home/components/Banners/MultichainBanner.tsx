import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerDesc,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'

const bgMobile = `${ASSET_CDN}/web/banners/multichain/bg-mobile.png`
const bgDesktop = `${ASSET_CDN}/web/banners/multichain/bg-desktop.png`

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

const participateLink = 'https://app.questn.com/quest/889561689480143342'

export const MultiChainBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const participateAction = (
    <LinkExternalAction href={participateLink} color="white" showExternalIcon={false}>
      <Flex alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Participate Now')}
        <ArrowForwardIcon color="white" ml="4px" />
      </Flex>
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="radial-gradient(338.53% 307.7% at 0% -37.33%, #5C6BB4 0%, #5AE1EC 100%)">
      <BannerMain
        badges={<PancakeSwapBadge whiteText />}
        title={<BannerTitle variant="orange">{t('PancakeSwap Multichain Celebration')}</BannerTitle>}
        desc={isMobile ? null : <BannerDesc color="white">{t('Starting MAR 14 - Over $3500 in prizes!')}</BannerDesc>}
        actions={<BannerActionContainer>{participateAction}</BannerActionContainer>}
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
