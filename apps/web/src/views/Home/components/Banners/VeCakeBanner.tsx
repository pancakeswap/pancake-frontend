import { Trans, useTranslation } from '@pancakeswap/localization'
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
import { useFourYearTotalVeCakeApr } from 'views/CakeStaking/hooks/useAPR'

const floatingAsset = `${ASSET_CDN}/web/banners/vecake/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/vecake/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/vecake/bg-mobile.png`

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 221,
  height: 182,
}

const VerticalDivider = styled.span`
  background: #000000;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
`

const BannerDesc = styled(Text)`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  color: #280d5f;
  white-space: nowrap;
`

const stakeCakeLink = '/cake-staking'
const learnMoreLink = 'https://docs.pancakeswap.finance/products/vecake'

const Desc = () => {
  return (
    <BannerDesc>
      <Trans>Discover other benefits like voting incentives...</Trans>
    </BannerDesc>
  )
}

export const VeCakeBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { totalApr } = useFourYearTotalVeCakeApr()

  const stakeCakeLinkAction = (
    <LinkExternalAction href={stakeCakeLink} showExternalIcon={false}>
      <Flex color="black" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Stake CAKE')}
        <ArrowForwardIcon color="#black" ml="4px" />
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="black" href={learnMoreLink}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="radial-gradient(100.66% 178.94% at 26.19% 58.89%, #53DEE9 0%, #1FC7D4 69.43%, #0098A1 100%)">
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge />
          </Flex>
        }
        desc={isMobile ? null : <Desc />}
        title={
          <BannerTitle variant="yellow">
            {isMobile || isTablet
              ? t('Stake CAKE - up to %apr%% APR !', {
                  apr: totalApr.toFixed(2),
                })
              : t('Stake CAKE and Earn up to %apr%% APR !', {
                  apr: totalApr.toFixed(2),
                })}
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
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
