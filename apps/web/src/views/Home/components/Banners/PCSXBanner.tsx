import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
  VerticalDivider,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const StyledBackgroundGraphic = styled(BackgroundGraphic)`
  & > div {
    background-size: contain !important;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    left: calc(100% - 272px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    left: 5%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    left: 50%;
    transform: translateX(-50%);
  }
`

const StyledBannerDesc = styled(Text)`
  color: #080808;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const StyledBannerTitle = styled(BannerTitle)`
  color: 'white',
  strokeColor: '#143360',
  strokeSize: 2,
  lineHeight: 30,
  fontWeight: 800,
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 23px;
  }
`

const PATH = `${ASSET_CDN}/web/banners/pcsx`
const BG = `${PATH}/pcsx-bg-large.png`
const BG_MEDIUM = `${PATH}/pcsx-bg-medium.png`
const XLOGO = `${PATH}/pcsx-xlogo.png`

const bgSmVariant: GraphicDetail = {
  src: BG_MEDIUM,
  width: 196,
  height: 112,
}

const bgXsVariant: GraphicDetail = {
  src: BG_MEDIUM,
  width: 170,
  height: 140,
}

const Desc = () => {
  const { t } = useTranslation()

  return (
    <StyledBannerDesc>
      {t('0 Trading Fees, Gasless Swaps, MEV Protection, and a Wide Range of Tokens — ALL on PancakeSwapX')}
    </StyledBannerDesc>
  )
}

export const PCSXBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isSm, isDesktop } = useMatchBreakpoints()

  const PlayNowAction = (
    <LinkExternalAction
      href="https://pancakeswap.finance/swap?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      color="#280D5F"
      externalIcon="arrowForward"
    >
      <Flex color="#280D5F" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Swap Now')}
      </Flex>
    </LinkExternalAction>
  )

  const LearnMoreAction = (
    <LinkExternalAction
      href="https://blog.pancakeswap.finance/articles/introducing-pancake-swap-x-zero-fee-and-gasless-swaps-on-ethereum-and-arbitrum?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      color="#280D5F"
    >
      <Flex color="#280D5F" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Learn More')}
      </Flex>
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(359.55deg, #6A5ED2 -2.68%, #B8B8E1 41.3%, #4A78AF 99.43%)">
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge whiteText />
          </Flex>
        }
        title={
          <StyledBannerTitle variant="white" marginTop={isSm ? '-6px' : '0px'} strokeSize={isMobile ? 1 : 2}>
            <span
              style={{
                color: '#FFE33E',
                textShadow: isMobile
                  ? `1px 1px 0 #143360, -1px -1px 0 #143360, 
                   1px -1px 0 #143360, -1px 1px 0 #143360`
                  : `2px 2px 0 #143360, -2px -2px 0 #143360, 
                   2px -2px 0 #143360, -2px 2px 0 #143360`,
              }}
            >
              {t('ZERO')}
            </span>
            &nbsp;
            {t('Fee Swaps on Ethereum and Arbitrum')}
          </StyledBannerTitle>
        }
        desc={isMobile ? null : <Desc />}
        actions={
          <BannerActionContainer>
            {PlayNowAction}
            {!isMobile && (
              <>
                <VerticalDivider
                  bg="#1F084B"
                  style={{
                    opacity: 0.4,
                  }}
                />

                {LearnMoreAction}
              </>
            )}
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <StyledBackgroundGraphic src={BG} sm={bgSmVariant} xs={bgXsVariant} width={468} height={224} className="" />
        <Box position="absolute" width="100%" top={isMobile ? '10%' : '0'} left="3%">
          <FloatingGraphic src={XLOGO} width={isMobile ? 70 : 100} height={isMobile ? 70 : 100} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
