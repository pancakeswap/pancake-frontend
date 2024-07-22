import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
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
import { useCallback, useState } from 'react'
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

const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/pancake-swap-airdrops-2-4-million-zk-tokens-to-the-community'

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
  const { isMobile, isTablet, isXs } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])
  const onDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <BannerContainer background="linear-gradient(180deg, rgba(39, 78, 234, 0.88) 74.72%, rgba(48, 90, 235, 0.88) 85.09%, rgba(74, 127, 239, 0.88) 94.31%, rgba(149, 231, 249, 0.88) 100%), linear-gradient(180deg, rgba(32, 68, 197, 0.20) 0%, rgba(65, 57, 168, 0.00) 100%), linear-gradient(0deg, #264FED 0%, #264FED 100%), linear-gradient(180deg, #CCA382 0%, #9DC38F 49.77%, #9FCCCF 100%);">
        <BannerMain
          badges={
            <StyledFlexContainer gap="8px">
              <PancakeSwapBadge whiteText />
              <Image src={zksyncLogo} alt="zkLogo" width={108} height={24} />
            </StyledFlexContainer>
          }
          title={
            <BannerTitle
              variant={{
                color: '#FFEB37',
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
              <LinkExternalAction onClick={onOpen} color="#FFE238" externalIcon="arrowForward">
                {t('Check Eligibility')}
              </LinkExternalAction>
              {!isMobile && (
                <>
                  <VerticalDivider />
                  <LinkExternalAction color="#FFE238" href={learnMoreLink}>
                    {t('Learn More')}
                  </LinkExternalAction>
                </>
              )}
            </BannerActionContainer>
          }
        />
        <BannerGraphics
          mb={['20px', '10px', '10px', '10px', '0']}
          style={{ zIndex: 3 }}
          paintBoardProps={{ style: { overflow: isXs ? 'hidden' : 'visible' } }}
        >
          <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
          <FloatingGraphic src={floatingAsset} width={isMobile ? 100 : 80} height={isMobile ? 100 : 80} />
        </BannerGraphics>
      </BannerContainer>
      <ClaimZksyncAirdropModal isOpen={isOpen} onDismiss={onDismiss} />
    </>
  )
}
