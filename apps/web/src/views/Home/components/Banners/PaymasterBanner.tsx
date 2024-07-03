import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  CoBrandBadge,
  GraphicDetail,
  LinkExternalAction,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const bgDesktop = `${ASSET_CDN}/web/banners/paymaster/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/paymaster/bg-mobile.png`
const coBrand = `${ASSET_CDN}/web/paymasters/zyfi-full-logo.png`

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
  '/swap?chain=zkSync&utm_source=homepagebanner&utm_medium=paymaster&utm_campaign=paymaster&utm_id=abc.123'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/pancake-swap-integrates-zyfi-on-zk-sync-era-enabling-gas-fee-payments-with-10-erc-20-tokens'

const Desc = () => {
  const { t } = useTranslation()
  return <BannerDesc>{t('Enjoy sponsored gas fees & earn Zyfi points')}</BannerDesc>
}

export const PaymasterBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const startTradeAction = (
    <LinkExternalAction href={startTradeLink} color="#280d5f" externalIcon="arrowForward">
      <Flex color="#280d5f" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Start Trading')}
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="#280d5f" href={learnMoreLink} style={{ whiteSpace: 'nowrap' }}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="radial-gradient(circle at center, #fedc9099, transparent), linear-gradient(85deg, #AABEA3 -25%, transparent), linear-gradient(#CCA382, #9DC38F, #9FCCCF)">
      <BannerMain
        badges={
          <Flex>
            <CoBrandBadge coBrand={coBrand} coBrandLogo={coBrand} cHeight={20} cWidth={50} dividerBg="#08080844" />
          </Flex>
        }
        desc={isMobile ? null : <Desc />}
        title={
          <BannerTitle variant="purple">
            {/* {isMobile || isTablet
              ? t('Pay gas with 10+ ERC-20 tokens')
              : t('Pay gas on zkSync Era PancakeSwap with 10+ ERC-20 tokens')} */}
            {isMobile || isTablet
              ? t('Enjoy Gas-Free Transactions on zkSync PancakeSwap')
              : t('Enjoy Gas-Free Transactions on zkSync Era PancakeSwap')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            {startTradeAction}
            {!isMobile && <VerticalDivider />}
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
