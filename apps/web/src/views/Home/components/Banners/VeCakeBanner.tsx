import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
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
import styled from 'styled-components'

const floatingAsset = `${ASSET_CDN}/web/banners/nemesis-downfall/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/nemesis-downfall/bg-mobile.png`
const bgImage = `${ASSET_CDN}/web/banners/nemesis-downfall/background-image.jpg`

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

const VerticalDivider = styled.span`
  background: #000000;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
`

const stakeCakeLink = '/cake-staking'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/introducing-nemesis-downfall-pancake-swap-s-latest-game-fi-release'

export const VeCakeBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const stakeCakeLinkAction = (
    <LinkExternalAction href={stakeCakeLink} showExternalIcon={false}>
      <Flex>
        <Text color="black" bold>
          {t('Stake CAKE')}
        </Text>
        <ArrowForwardIcon color="black" />
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="black" href={learnMoreLink}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background={`url('${bgImage}')`}>
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge />
          </Flex>
        }
        title={
          <BannerTitle variant="orange">
            {isMobile || isTablet ? t('Stake CAKE - up to 12.34% APR !') : t('Stake CAKE and Earn up to 12.34% APR !')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            {stakeCakeLinkAction}
            {isMobile ? null : <VerticalDivider />}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics mb={['20px', '10px', '10px', '10px', '0']}>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
