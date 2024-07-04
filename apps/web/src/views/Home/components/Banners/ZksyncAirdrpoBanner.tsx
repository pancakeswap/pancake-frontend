import { useTranslation } from '@pancakeswap/localization'
import { Button, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
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
import { useUserWhiteListData } from 'components/ClaimZksyncAirdropModal/hooks'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { useEffect, useRef, useState } from 'react'
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
  const whitelistData = useUserWhiteListData()
  const isModalOpened = useRef(false)

  useEffect(() => {
    if (whitelistData?.account && whitelistData?.amount && whitelistData?.proof && isModalOpened.current === false) {
      setIsOpen(true)
      isModalOpened.current = true
    }
  }, [whitelistData])

  return (
    <>
      <BannerContainer background="linear-gradient(180deg, rgba(39, 78, 234, 0.88) 74.72%, rgba(48, 90, 235, 0.88) 85.09%, rgba(74, 127, 239, 0.88) 94.31%, rgba(149, 231, 249, 0.88) 100%), linear-gradient(180deg, rgba(32, 68, 197, 0.20) 0%, rgba(65, 57, 168, 0.00) 100%), linear-gradient(0deg, #264FED 0%, #264FED 100%), linear-gradient(180deg, #CCA382 0%, #9DC38F 49.77%, #9FCCCF 100%);">
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
                  <Button
                    onClick={() => {
                      setIsOpen(true)
                    }}
                  >
                    {t('Claim')}
                  </Button>
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
