import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const bgDesktop = `${ASSET_CDN}/web/banners/fee-refund/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/fee-refund/bg-mobile.png`

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

const startTradeLink =
  '/swap?chain=eth&utm_source=homepagebanner&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/get-your-uniswap-interface-fees-refunded-on-pancake-swap-up-to-8-m?utm_source=homepagebanner&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund'

const Desc = () => {
  const { t } = useTranslation()
  return <BannerDesc>{t("Match your volume and we'll refund ALL your interface fees paid")}</BannerDesc>
}

export const FeeRefundBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const startTradeAction = (
    <LinkExternalAction href={startTradeLink} color="black" externalIcon="arrowForward">
      <Flex color="black" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Start Trading')}
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="black" href={learnMoreLink} style={{ whiteSpace: 'nowrap' }}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(213deg, #9AEDFF -10.64%, #CCC2FE 77.81%, #C6A3FF 105.44%)">
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge />
          </Flex>
        }
        desc={isMobile ? null : <Desc />}
        title={
          <BannerTitle variant="purple">
            {isMobile || isTablet
              ? t('Up to $8M in interface fees paid refunded!')
              : t('Get up to $8M USD in interface fees paid refunded on PancakeSwap')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            {startTradeAction}
            {isMobile ? null : <VerticalDivider />}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
