import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerDesc,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
  VerticalDivider,
} from '@pancakeswap/widgets-internal'
import { ClaimZksyncAirdropModal } from 'components/ClaimZksyncAirdropModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { useState } from 'react'
import styled from 'styled-components'

const bgMobile = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/bunny-bg-mobile.png`
const bgDesktop = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/bunny-bg.png`
const floatingAsset = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/floating.png`
const zksyncLogo = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/zksync-logo.png`

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

const startTradingLink =
  'https://perp.pancakeswap.finance/en/futures/v2/BTCUSD?chain=Arbitrum&utm_source=homepagebanner&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/trade-on-arbitrum-pancake-swap-perpetual-v2-to-win-300-000-arb?utm_source=homepagebanner&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives'

const StyledFlexContainer = styled(FlexGap)`
  align-items: center;
  color: white;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 450px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 450px;
  }
`

export const ZksyncAirDropBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet, isMd } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <BannerContainer background="linear-gradient(140deg, #7645d9 0%, #452a7a 100%)">
        <BannerMain
          badges={
            <StyledFlexContainer gap="8px">
              <PancakeSwapBadge whiteText />
              {!(isMobile || isMd) ? (
                <Text bold color="white">
                  Perpetual v2
                </Text>
              ) : null}
              <Image src={zksyncLogo} alt="arbLogo" width={108} height={24} />
            </StyledFlexContainer>
          }
          title={
            <BannerTitle
              variant={{
                color: '#FFB237',
                strokeColor: '',
                strokeSize: 0,
                fontSize: isTablet ? 24 : 26,
                lineHeight: 30,
                fontWeight: 800,
              }}
            >
              {t('Claim Your $ZK Airdrop Rewards!')}
            </BannerTitle>
          }
          desc={<BannerDesc color="white">{!isMobile ? t('2.4 Million $ZK available to claim') : null}</BannerDesc>}
          actions={
            <BannerActionContainer>
              {isMobile ? (
                <LinkExternalAction color="white" href={learnMoreLink} externalIcon="arrowForward">
                  {t('Learn More')}
                </LinkExternalAction>
              ) : (
                <>
                  <LinkExternalAction color="white" href={startTradingLink} externalIcon="arrowForward">
                    {t('Start Trading')}
                  </LinkExternalAction>
                  <VerticalDivider />
                  <LinkExternalAction color="white" href={learnMoreLink}>
                    {t('Learn More')}
                  </LinkExternalAction>
                </>
              )}
            </BannerActionContainer>
          }
        />
        <BannerGraphics mb={['20px', '10px', '10px', '10px', '0']}>
          <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
          <FloatingGraphic src={floatingAsset} width={100} height={100} />
        </BannerGraphics>
      </BannerContainer>
      <ClaimZksyncAirdropModal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}
