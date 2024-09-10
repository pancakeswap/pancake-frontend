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
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useMemo } from 'react'
import styled from 'styled-components'

const StyledBackgroundGraphic = styled(BackgroundGraphic)`
  left: calc(100% - 196px);

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
  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const PATH = `${ASSET_CDN}/web/banners/tg-prediction-bot`
const floatingAsset = `${PATH}/floating.png`

const bgSmVariant: GraphicDetail = {
  src: `${PATH}/bunny-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${PATH}/bunny-md.png`,
  width: 196,
  height: 164,
}

const whiteVariant = {
  color: '#3E04B0',
  strokeColor: 'white',
  strokeSize: 2,
  fontSize: 28,
  lineHeight: 30,
  fontWeight: 800,
}

const Desc = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const endTime = 1727049599 // 22nd Sep 23:59 UTC

  const isCampaignEnded = useMemo(() => new Date().getTime() / 1000 >= endTime, [endTime])

  if (isMobile) return <></>

  return (
    <StyledBannerDesc>
      {isCampaignEnded
        ? t('Predict BNB price every 5 minutes to win a share of the round’s prize pool')
        : t('Predict BNB Price and Celebrate Our 4th Birthday with $4,444 rewards')}
    </StyledBannerDesc>
  )
}

export const TgPredictionBotBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isSm } = useMatchBreakpoints()

  const PlayNowAction = (
    <LinkExternalAction href="https://t.me/pancakefi_bot" color="#280D5F" externalIcon="arrowForward">
      <Flex color="#280D5F" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Play Now on Telegram')}
      </Flex>
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(64deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0.00) 102.8%), radial-gradient(113.12% 140.14% at 26.47% 0%, #0AF 0%, #0BADFE 50%, #A2DAF5 100%)">
      <BannerMain
        badges={
          <Flex>
            <PancakeSwapBadge whiteText />
          </Flex>
        }
        title={
          <BannerTitle variant={whiteVariant} marginTop={isSm ? '-6px' : '0px'}>
            {t('Introducing PancakeSwap Prediction Telegram Bot')}
          </BannerTitle>
        }
        desc={isMobile ? null : <Desc />}
        actions={<BannerActionContainer>{PlayNowAction}</BannerActionContainer>}
      />

      <BannerGraphics>
        <StyledBackgroundGraphic
          src={`${PATH}/bunny-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={468}
          height={224}
          className=""
        />
        <Box position="absolute" width="100%" top={isMobile ? '10%' : '0'} left="3%">
          <FloatingGraphic src={floatingAsset} width={isMobile ? 70 : 100} height={isMobile ? 70 : 100} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
