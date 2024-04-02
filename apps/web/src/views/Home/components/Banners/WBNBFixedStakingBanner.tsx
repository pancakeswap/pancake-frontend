import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Flex, Text } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  ButtonLinkAction,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'

import { ASSET_CDN } from 'config/constants/endpoints'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

const floatingAsset = `${ASSET_CDN}/web/banners/wbnb-fixed-staking/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/wbnb-fixed-staking/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/wbnb-fixed-staking/bg-mobile.png`

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

const BannerDesc = styled(Text)`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  color: #280d5f;
  white-space: nowrap;
`

const VerticalDivider = styled.span`
  background: #858585;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
`

const Floating = styled(FloatingGraphic)`
  left: 3%;
  top: 10%;

  ${({ theme }) => theme.mediaQueries.sm} {
    left: 2%;
    top: 10%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    left: 2%;
    top: 0;
  }
`
const StyledButtonLinkAction = styled(ButtonLinkAction).withConfig({
  shouldForwardProp: (prop) => prop !== 'showExternalIcon',
})`
  height: 33px;
  border-radius: 12px;
  padding: 0 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 48px;
    border-radius: 16px;
  }
  & > a > svg {
    display: ${({ showExternalIcon }) => (showExternalIcon ? 'static' : 'none')};
  }
`
const stakeLink =
  'https://pancakeswap.finance/simple-staking?utm_source=homepagebanner&utm_medium=website&utm_campaign=homepage&utm_id=WBNBsimplestakingcampaign'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/stake-wbnb-on-pancake-swap-to-win-combo-rewards-5-000-extra-reward-pool?utm_source=homepagebanner&utm_medium=website&utm_campaign=homepage&utm_id=WBNBsimplestakingcampaign'

export function WBNBFixedStakingBanner() {
  const { t } = useTranslation()

  const stakeAction = isMobile ? (
    <StyledButtonLinkAction href={stakeLink} color="white">
      <Flex alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Stake Now')}
        <ArrowForwardIcon color="white" ml="4px" />
      </Flex>
    </StyledButtonLinkAction>
  ) : (
    <LinkExternalAction href={stakeLink} color="#280D5F" showExternalIcon={false}>
      <Flex alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Stake your WBNB here')}
        <ArrowForwardIcon color="#280D5F" ml="4px" />
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = isMobile ? (
    <StyledButtonLinkAction
      href={learnMoreLink}
      color="white"
      ellipsis
      showExternalIcon
      style={{ whiteSpace: 'nowrap' }}
    >
      {t('Learn More')}
    </StyledButtonLinkAction>
  ) : (
    <LinkExternalAction href={learnMoreLink} color="#280D5F" style={{ whiteSpace: 'nowrap' }}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(64deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0.00) 102.8%), radial-gradient(113.12% 140.14% at 26.47% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple">
            {isMobile ? t('Stake WBNB, Win Combo Rewards!') : t('Stake WBNB to Win Combo Rewards')}
          </BannerTitle>
        }
        desc={isMobile ? null : <BannerDesc>{t('$5,000 extra reward pool')}</BannerDesc>}
        actions={
          <BannerActionContainer>
            {stakeAction}
            {isMobile ? null : <VerticalDivider />}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <Floating src={floatingAsset} width={90} height={90} />
      </BannerGraphics>
    </BannerContainer>
  )
}
